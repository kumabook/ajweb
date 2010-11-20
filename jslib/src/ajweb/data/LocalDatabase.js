/**
 * @fileOverview クライアントごとのローカルなデータクラスを定義。
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */

dojo.require("ajweb.data.AbstractDatabase");

dojo.require("ajweb.data.sql");
dojo.provide("ajweb.data.LocalDatabase");



dojo.declare("ajweb.data.LocalDatabase", ajweb.data.AbstractDatabase,
  /** @lends ajweb.data.LocalDatabase.prototype */
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

    this.create();

    if(!opt.type)
      this.type = "local";
  },
  /**
   * データベース作成:
   * @return
   */
  create : function() {
    if(window.google && google.gears)
      ajweb.sql.create(this.tablename, this.properties);
  },
  /**
   * 削除
   * @return
   */
  drop : function(){
    if(window.google && google.gears)
      ajweb.sql.drop(this.tablename);
  },

  /**
   * insert
   * @return
   */
  insert: function(params){
    if(window.google && google.gears){
      var item = ajweb.sql.insert(this.tablename, this.properties, params);
      this.saveHistory("insert",item);
    }
  },
  /**
   * 削除
   * @return
   */
  remove: function(params){
    if(window.google && google.gears){
      ajweb.sql.remove(this.tablename, params);
    }
  },
    /**
   * 更新
   * @return
   */
  update: function(params){
    if(window.google && google.gears){
      ajweb.sql.update(this.tablename, this.properties, params);
    }
  },
  /**
   * 取得
   * @return
   */
  select: function(where, next){
    if(window.google && google.gears){
      var items = ajweb.sql.select(this.tablename, this.properties, where);
      next(items);
    }
  },

  /**
   * データをクリア
   * @return
   */
  clear: function(){
  },
  load: function(){
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
  }
});
