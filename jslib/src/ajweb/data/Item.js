/**
 * @fileOverview イベントやポーリングの条件式に用いるデータベースの要素をあらわすクラスを定義
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 * 11/7
 */

dojo.provide("ajweb.data.Item");

dojo.declare("ajweb.data.Item", null,
  {
    constructor: function(opt){
//      this.element = opt.element;
      this.type = opt.type;// = "targetItem";
      this.database = opt.database;
      this.property = opt.property;

    },

    toJSON: function(){
      return property;
    }
  }
);
