/**
 * @fileOverview データクラスを定義。
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */


dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("ajweb.sql");
dojo.provide("ajweb.data.Database");
/** @namespace */
ajweb.data = {};
dojo.declare("ajweb.data.Database", null,
  /** @lends ajweb.data.Database.prototype */
{
  /**
   * データベースクラス
   * @constructs
   *
   * @param {Object} opt 初期用オブジェクト
   * @param {String} opt.url データベースアクセスのサーバプログラムのurl
   * @param {String} opt.tablename テーブル名
   * @param {Array<String>} opt.properties カラム名の配列
   * @param {param} opt.param condition 保留
   *
   * */
  constructor : function(opt){
        /** id
     * @field */
    this.id = opt.id;
    /** データベースアクセスのサーバプログラムのurl
     * @field */
    this.url = opt.url;
    /** テーブル名
     * @field */
    this.tablename = opt.tablename;
    /** カラムの配列
     * @field */
    this.properties = opt.properties;
//    this.properties.push("id");
    var isContainId = false;
    this.param = opt.param;//condition
    /** 実際のデータを保持(dojo.data.ItemFileWriteStoreを利用)
      * @field */
    this.store = new dojo.data.ItemFileWriteStore({ identifier: "id", data: {  items: []}});
    this.create();
    this.history_tablename = opt.tablename + "_history";
//  this.history_properties = opt.properties
  },
  /**
   * データベース作成:
   * @return
   */
  create : function() {
    ajweb.sql.create(this.tablename, this.properties);
  },
  /**
   * 削除
   * @return
   */
  drop : function(){
    ajweb.sql.drop(this.tablename);
  },
    /**
   * サーバのデータをフェッチ
   * @return
   */
  fetch : function(){//読み込みなおし、clearとselect
    var store = this.store;
    if(navigator.onLine){//onlineならサーバからデータを取得
      ajweb.send("dbservlet",
		 this.tablename,
		 "select",
		 null,
		 function(data){
		   var items = data.items;
		   for(var i = 0; i < items.length; i++){
		     console.log("fetch: " + dojo.toJson(items[i]));
		     store.newItem(items[i]);
		   }
		 }
		);
    }
    else{
      this.clear();
      var items = this.select();
      for(var i = 0; i < items.length; i++){
//	     alert(dojo.toJson(items[i]));
	this.store.newItem(items[i]);
      }
 }
  },
    /**
   * insert
   * @return
   */
  insert: function(params){
    if(navigator.onLine){//onlineならサーバに送信
      ajweb.send("dbservlet",
		 this.tablename,
		 "insert",
		 params
		);

    }
    else {//offlineならローカルデータベースに保存し、変更履歴を保存。
      var item = ajweb.sql.insert(this.tablename, this.properties, params);
      this.store.newItem(item);
      this.saveHistory("insert",item);
//      alert(dojo.toJson(item));
    }
  },
    /**
   * 削除
   * @return
   */
  remove: function(params){
    if(navigator.onLine){
      ajweb.send("dbservlet",
		 this.tablename,
		 "delete",
		 params
		);
    }
    else {
      ajweb.sql.remove(this.tablename, params);
      this.saveHistory("delete", params);
      var store = this.store;
      store.fetch({
		  query: {id : params.id},
		  onComplete: function(items, request){
		    for(var i = 0; i < items.length; i++){
		      store.deleteItem(items[i]);
		    }
		  }
		  }
		 );
    }
  },
    /**
   * 更新
   * @return
   */
  update: function(params){
    //alert("update ");// + dojo.toJson(params));
    var json = ajweb.toJSON(params);
    if(navigator.onLine){
      console.log("update online");
      ajweb.send("dbservlet",
		 this.tablename,
		 "update",
		 params
		);
    }
    else {
    ajweb.sql.update(this.tablename, this.properties, params);
      var properties = this.properties;
//      console.log(dojo.toJson(params));
      this.saveHistory("update", params);
      var store = this.store;
      store.fetch({
		    query: {id : params.id},
	 onComplete: function(items, request){//ここに重い処理はかかない
	   for(var i = 0; i < items.length; i++){
	     for(var j = 0; j < properties.length; j++){
	       store.setValue(items[i], properties[j], params[properties[j]]);
	     }
	   }
	 }
	}
      );
    }
  },
    /**
   * 取得
   * @return
   */
  select: function(where){
   var items;
    if(navigator.onLine){
/*      ajweb.send("dbservlet",
		 this.tablename,
		 "select",
		 null,
		 function(data){
		   items = data.items;
		 }
		);
      return items;*/
    }
//    else {
      return ajweb.sql.select(this.tablename, this.properties, where);
  //  }

  },
    /**
   * 履歴を保存
   * @return
   */
  saveHistory : function(action, params){
  var properties = this.properties;
    this.properties.push("action");
    params.action = action;
    ajweb.sql.insert(this.history_tablename, this.properties, params);
    this.properties.pop();
  },
  /**
   * データをクリア
   * @return
   */
  clear: function(){
    var store = this.store;
    store.fetch({
		  onComplete: function(items, request){
		    for(var i = 0; i < items.length; i++){
		      store.deleteItem(items[i]);
		    }
		  }
		}
	       );
  },
  /**
   * 履歴を取得
   * @return
   */
  getHistory : function(){
    this.properties.push("action");
    var histories = ajweb.sql.select(this.history_tablename, this.properties);
    this.properties.pop();
    return histories;
  },
	/**
	 * inspectメソッド：デバッグ情報を出力
	 * @return {String} デバッグ用出力
	 *
	 * @example
	 *  button.inspect();
	 */
  inspect : function(){
    return "dataStore" + this.id;
  }
});


ajweb.data.Database.getStore = function(name){
  for(var i = 0; i < ajweb.stores.length; i++){
    alert(ajweb.stores[i].tablename  + "  " + name);
    if(ajweb.stores[i].tablename == name)
      return ajweb.stores[i];
  }
  return null;
};




dojo.addOnLoad(function(){

dojo.declare("ajweb.data._store", dojo.data.ItemFileWriteStore,
	     {

	       getItems: function(){
		 var result = {};
		 this.fetch({
			      onComplete: function(items, request){
				alert(items);
				result = items;
			      }

			    });
		 return result;
	       }
	     }
	    );

});
