/**
 * @fileOverview データクラスを定義。
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */

dojo.require("ajweb.data.AbstractDatabase");
dojo.require("ajweb.data.LocalDatabase");
dojo.require("ajweb.data.Condition");
dojo.provide("ajweb.data.Database");


dojo.declare("ajweb.data.Database", ajweb.data.AbstractDatabase,
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
   *
   * */
  constructor : function(opt){

    /** データベースアクセスのサーバプログラムのurl
     * @field */
    this.url = opt.url;
    this.type = "server";
    /** キャッシュ用ローカルデータベース
     * @field */
    this.cacheDatabase = new ajweb.data.LocalDatabase(
      {
	id: this.id+"_cache",
	tablename: this.id+"_cache",
	properties: this.properties,
	type: "local_cache"
      }
    );
    /** 変更履歴用ローカルデータベース
     * @field */
    this.actionHistoryDataabse = new ajweb.data.LocalDatabase(
      {
	id: this.id+"_action_history",
	tablename: this.id+"_action_history",
	properties: this.properties.concat(["action", "timestamp"]),
	type: "local_action_history"
     }
    );
    ajweb.databases.push(this);//ポーリングを行うデータベースリストに追加
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
    else {//オフラインならローカルへ変更を保存し、変更履歴も保存
    if(window.google && google.gears)
      var item = ajweb.sql.insert(this.tablename, this.properties, params);
      this.saveHistory("insert",item);
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
    else {//オフラインならローカルへ変更を保存し、変更履歴も保存
      ajweb.sql.remove(this.tablename, params);
      this.saveHistory("delete", params);
    }
  },
    /**
   * 更新
   * @return
   */
  update: function(params){
    var json = ajweb.toJSON(params);
    if(navigator.onLine){
      ajweb.send("dbservlet",
		 this.tablename,
		 "update",
		 params
		);
    }
    else {//オフラインならローカルへ変更を保存し、変更履歴も保存
          if(window.google && google.gears)
	    ajweb.sql.update(this.tablename, this.properties, params);
      var properties = this.properties;
      this.saveHistory("update", params);
    }
  },
    /**
   * 取得
   * @return
   */
  select: function(where, next){
   var items;
    if(navigator.onLine){
      ajweb.send("dbservlet",
		 this.tablename,
		 "select",
		 where,
		 function(data){
		   next(data.items);
		   //キャッシュとして保存
		     //		 items = data.items;
		 }
		);
//      return items;
      return true;
    }
    else {//オフラインならローカルのデータベースにキャッシュされた値を読み込む
      if(window.google && google.gears)
	return ajweb.sql.select(this.tablename, this.properties, where);
      return {};
    }
  },
    /**
   * 履歴を保存
   * @return
   */
  saveActionHistory : function(action, params){
  var properties = this.properties;
    this.properties.push("action");
    params.action = action;
    if(window.google && google.gears)
      ajweb.sql.insert(this.history_tablename, this.properties, params);
    this.properties.pop();
  },
  getCache: function(){

  },
  /**
   * キャッシュをクリア
   * @return
   */
  clearCache: function(){

  },
  /**
   * 変更履歴をクリア
   * @return
   */
  clearActionHistory: function(){

  },
  /**
   * 変更履歴を送信
   * @return
   */
  sendActionHistory: function(){

  },
  /**
   * 履歴を取得
   * @return
   */
  getActionHistory : function(){
    this.properties.push("action");
    if(window.google && google.gears)
      var histories = ajweb.sql.select(this.history_tablename, this.properties);
    this.properties.pop();
    return histories;
  },
  /**
   * inspectメソッド：デバッグ情報を出力
   * @return {String} デバッグ用出力
   */
  inspect : function(){
    return "dataStore" + this.id;
  },
  onInsert: function(item){
    ajweb.log.trace("onInsert: " + dojo.toJson(item));
    ajweb.log.info("onInsert: " + dojo.toJson(item));
  },
  onDelete: function(){
    ajweb.log.trace("onDelete: "  + dojo.toJson(item));
  },
  onUpdate: function(){
    ajweb.log.trace("onUpdate: "  + dojo.toJson(item));
  },
  onChange: function(){
    ajweb.log.trace("onChange: "  + dojo.toJson(item));
  },
  getStore: function(name){
  for(var i = 0; i < ajweb.stores.length; i++){
//    alert(ajweb.stores[i].tablename  + "  " + name);
    if(ajweb.stores[i].tablename == name)
      return ajweb.stores[i];
  }
  return null;
  }
});
