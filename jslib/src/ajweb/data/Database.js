/**
 * @fileOverview データクラスを定義。
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.require("ajweb.base");

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
//	properties_list: this.properties_list,
	type: "local_cache"
      }
    );
    /** 変更履歴用ローカルデータベース
     * @field */
    this.actionHistoryDataabse = new ajweb.data.LocalDatabase(
      {
	id: this.id+"_action_history",
	tablename: this.id+"_action_history",
	properties: this.properties,
//	properties_list: this.properties_list.concat(["action", "timestamp"]),
	type: "local_action_history"
     }
    );

    ajweb.server_databases.push(this);//ポーリングを行うデータベースリストに追加

  },
  /**
   * insert
   * @return
   */
  insert: function(params, next){
    if(navigator.onLine){//onlineならサーバに送信
      ajweb.send("dbservlet",
		 this.tablename,
		 "insert",
		 this.encodeRefItem(params),
		 next
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
  remove: function(params, next){
    if(navigator.onLine){
      ajweb.send("dbservlet",
		 this.tablename,
		 "delete",
		 params,
		 next
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
  update: function(params, next){
    var json = ajweb.toJSON(params);
    if(navigator.onLine){
      ajweb.send("dbservlet",
		 this.tablename,
		 "update",
		 this.encodeRefItem(params),
		 next
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
  select: function(param, next){
    if(param instanceof Function)
      next = param;
    return this._select(null, next);
  },
  _select: function(json, next){
   var items;
    if(navigator.onLine){
      ajweb.send("dbservlet",
		 this.tablename,
		 "select",
		 json,
		 function(data){
		   console.log(data.items);
		   next(data.items);
		   //キャッシュとして保存
		     //		 items = data.items;
		 }
		);
//      return items;
      return true;
    }
    else {//オフラインならローカルのデータベースにキャッシュされた値を読み込む
      if(window.google && google.gears){
	next(ajweb.sql.select(this.tablename, this.properties, where));
	return {};
	}
      return {};
    }
  },
  selectByCondition: function(param, next){//where, next){
/*    if(!where)
      return this._select(null, next);
    where = this.encodeRefItem(where);
    var param = where.toJSON();
    return this._select(param, next);*/
    if(param.condition)
     return this._select(param.condition.toJSON(), next);
  },
  selectByConditionFirst: function(param, next){
    if(param.condition)
     return this._select(param.condition.toJSON(), function(items){
			   next(items[0]);
			 });
  },
  selectById: function(param, next){
    return this._select({op: "eq", property: param.idProperty, value: param.idValue}, 
			function(items){
			  if(items.length > 0)
			    next(items[0]);
			});
  },
  selctByIdProperty: function(param, next){
    return this._select({op: "eq", property: param.idProperty, value: param.idValue}, 
			function(items){
			  if(items.length > 0)
			    next(items[0][param.property]);
			});
  },
  check: function(params, next){
    if(navigator.onLine){//onlineならサーバに送信
      ajweb.send("dbservlet",
		 this.tablename,
		 "check",
		 this.encodeRefItem(params),
		 next
		);
    }
    else {//オフラインならローカルへ変更を保存し、変更履歴も保存 要検討
    if(window.google && google.gears)
      var item = ajweb.sql.insert(this.tablename, this.properties, params);
      this.saveHistory("check",item);
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
  onDelete: function(item){
    ajweb.log.trace("onDelete: "  + dojo.toJson(item));
  },
  onUpdate: function(item){
    ajweb.log.trace("onUpdate: "  + dojo.toJson(item));
  },
  onChange: function(item){
    ajweb.log.trace("onChange: "  + dojo.toJson(item));
  },
  encodeRefItem: function(params){
  for(var i= 0; i < this.properties_list.length; i++){
//    if(params[this.properties_list[i]] instanceof ajweb.data.date || //参照型ならidに変換
  //     params[this.properties_list[i]] instanceof ajweb.dataItem)
      if(params[this.properties_list[i]] instanceof Object //参照型ならidに変換
	&& !(params[this.properties_list[i]] instanceof ajweb.data.Item
	     || params[this.properties_list[i]] instanceof ajweb.date)
	){
	params[this.properties_list[i]] =  params[this.properties_list[i]].id;
      }
    }
    return params;
  }
});

