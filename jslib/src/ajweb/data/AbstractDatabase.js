/**
 * @fileOverview データクラスを定義。
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */

dojo.require("ajweb.base");
dojo.require("ajweb.data.base");
dojo.require("ajweb.data.Item");



dojo.provide("ajweb.data.AbstractDatabase");

dojo.declare("ajweb.data.AbstractDatabase", null,
  /** @lends ajweb.data.AbstractDatabase.prototype */
{
  /**
   * データベースクラス
   * @constructs
   *
   * @param {Object} opt 初期用オブジェクト
   * @param {String} opt.tablename テーブル名
   * @param {Array<String>} opt.properties カラム名の配列
   *
   * */
  constructor : function(opt){
        /** id
     * @field */
    this.id = opt.id;
    /** テーブル名
     * @field */
    this.tablename = opt.tablename;
    /** カラムとその型のハッシュ
     * @field */
    this.properties = opt.properties;
    /** カラムの配列
     * @field */
    this.properties_list = opt.properties_list;
    /** 参照のテーブルのリスト
     * @field */
    this.ref = opt.ref;
    /** ポーリング条件のリスト
     * @field */
    this.conditions = [];
    /** データベースのタイプ(サーバかクライアントか)
     * @field */
    this.type = opt.type;
    ajweb.addElement(this);
    ajweb.databases.push(this);//ポーリングを行うデータベースリストに追加
  },
  /**
   * 挿入
   * @return
   */
  insert: function(params){
  },
  /**
   * 削除
   * @return
   */
  remove: function(params){
  },
  /**
   * 更新
   * @return
   */
  update: function(params){
  },
    /**
   * 取得
   * @return
   */
  select: function(where, next){
  },
  getRefItem: function(property){
    var refDatabase;
    if(this.ref[property]){
      if(this.ref[property].multiplicity == "*"){
	refDatabase = ajweb.data.getDatabaseById(property);
	if(refDatabase)
	  refDatabase.select();
      }
      else {

      }
    }
  },
  /**
   * ajweb.data.AbstractDatabase を追加
   * @return
   */
  addCondition: function(condition){
    this.conditions.push(condition);
  },
  /**
   * inspectメソッド：デバッグ情報を出力
   * @return {String} デバッグ用出力
   *
   * @example
   *  button.inspect();
   */

  onInsert: function(item){
    ajweb.log.trace("onInsert: " + dojo.toJson(item));
//    ajweb.log.info("onInsert: " + dojo.toJson(item));
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
  inspect : function(){
    return "dataStore" + this.id;
  }
});
