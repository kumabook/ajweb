/**
 * @fileOverview 参照型を表すクラス
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 * 11/11
 */

dojo.provide("ajweb.data.Ref");

dojo.declare("ajweb.data.Ref", null,
  {
    constructor: function(opt){
      this.ref = opt.ref;
      this.database = opt.database;
      this.property = opt.property;

    },

    toJSON: function(){
      return property;
    }
  }
);

