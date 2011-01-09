dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Event");

dojo.provide("ajweb.editor.model.Event");
dojo.declare("ajweb.editor.model.Event", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Event.prototype */
  {
    /**
     * Constructor
     * @class イベントモデルのクラス
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {Array} opt.acceptModelType 子要素に持てる要素
     * @param {DOM} opt.parent 配置されるDOM要素
     */
    constructor: function(opt)
    {
      var target = this.application.getElementByPropId(this.properties.target);
      if(target)
	target.events.push(this);
    },
    getProjLabel: function(){
      return this.properties.target+":"+this.properties.type;
    },
    remove: function(){
      this.inherited(arguments);
      var target = this.application.getElementByPropId(this.properties.target);
      if(target)
	for(var i = 0; i < target.events.length; i++){
	  if(this == target.events[i]){
	    target.events.splice(i, 1);
	  }
	}
    },
   getCondition: function(){
      for(var i = 0; i < this.children.length; i++){//すでに存在する場合は表示しない。
	if(this.children[i].tagName == "condition"){
	  return this.children[i];
	}
      }
     return null;
   }
  }
);
