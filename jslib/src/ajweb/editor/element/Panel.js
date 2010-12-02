dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Resizable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Panel");
dojo.declare("ajweb.editor.element.Panel", 
	     [ajweb.editor.element.Element, 
	      ajweb.editor.element.DndEnable, 
//	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Resizable],
  /** @lends ajweb.editor.element.Panel.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
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
	  id : this.id,
	  title: this.id,
	  closable: true,
	  doLayout: false
	});
      this.panel = new dijit.layout.ContentPane(
	{
	  id : this.id+ "_panel",
	  style:{
	    position: "absolute",
	    width: properties.width,
	    height: properties.height,
	    top: "10%",
	    left: "20%",
	    backgroundColor: "#E1EBFB",
	    border: "solid 1px #769DC0"
	  }
	});
      this.widget.domNode.appendChild(this.panel.domNode);
      return this.panel.domNode;
    },
    updateDom: function(){
      var top =  (parseInt(this.widget.domNode.style.height) -
		  parseInt(this.model.properties.height)) / 2;
      var left = (parseInt(this.widget.domNode.style.width) -
		  parseInt(this.model.properties.width)) / 2;
      this.model.top = top;
      this.model.left = left;
      this.domNode.style.width = this.model.properties.width;
      this.domNode.style.height = this.model.properties.height;
      this.domNode.style.top = top;
      this.domNode.style.left = left;
    },
    createDndDomNode: function(){
      return this.domNode;
    },
    createMoveContainerDomNode: function(){
      return this.widget.domNode;
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
      this.panel.startup();
      this.updateDom();
    }
  }
);