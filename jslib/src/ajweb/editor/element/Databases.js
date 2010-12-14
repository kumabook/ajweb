dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Databases");
dojo.declare("ajweb.editor.element.Databases", [ajweb.editor.element.Element,ajweb.editor.element.DndEnable],
  /** @lends ajweb.editor.element.Databases.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {boolean} opt.resizable サイズが変更可能か
     * @param {boolean} opt.movable 位置が変更可能か
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {},
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var that = this;
      this.widget =   new dijit.layout.ContentPane(
	{
//	  title: this.id,
	  title: ajweb.getValue("databases"),
	  closable: true,
	  doLayout: false,
	  style:{
	    border: "solid 1px #769DC0"
	  },
	  onClose: function(){
	    that.model.clearPropertiesView();
	    that.model.clearEventView();
	    for(var i = 0; i < that.model.children.length; i++){
	      that.model.children[i].removeDom();
	    }
	    return true;
	  }
	});
      this.widget.modelId = this.model.id;
      return this.widget.domNode;
    },
    updateDom: function(properties){
//      this.widget.set({ title: properties.id});
    },
    removeDom: function(){
      this.widget.destroyRecursive();
    },
    createDndDomNode: function(){
      return this.domNode;
    },
    startup: function(){
      this.inherited("startup",arguments);
    }
  }
);