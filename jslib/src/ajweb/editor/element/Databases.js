dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Databases");
dojo.declare("ajweb.editor.element.Databases",
  [ajweb.editor.element.Element,
   ajweb.editor.element.DndEnable],
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
	  title: ajweb.resources.databases,
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

	    that.model.properties._isDisplay = "false";
	    return true;
	  }
	});
      this.model.properties._isDisplay = "true";
      this.widget.jsId = this.model.id;
      return this.widget.domNode;
    },
    onDrop: function(name){
      var databaseModel = this.model.editor.newModel(
	name,
	{
	  top: ajweb.editor.mousePosition.y - ajweb.editor.getY(this.container.domNode),
	  left: ajweb.editor.mousePosition.x - ajweb.editor.getX(this.container.domNode)
	},
	this.model,
	this
      );
      var initModel = this.model.editor.newModel(
	"init",	{}, databaseModel, databaseModel.element
      );
    },
    updateDom: function(){
//      this.widget.set({ title: this.model.properties.id});
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