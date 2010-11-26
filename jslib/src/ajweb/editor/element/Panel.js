dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Resizable");
dojo.require("ajweb.editor.element.Movable");

dojo.provide("ajweb.editor.element.Panel");
dojo.declare("ajweb.editor.element.Panel", 
	     [ajweb.editor.element.Element, 
	      ajweb.editor.element.DndEnable, 
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Resizable],
  /** @lends ajweb.editor.element.Panel.prototype */
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
	  id : this.id,
	  title: this.id,
	  width: properties.width,
	  height: properties.height,
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
	    top: "50px",
	    left: "50px",
	    backgroundColor: "#E1EBFB",
	    border: "solid 1px #769DC0"
	  }
	});
      this.widget.domNode.appendChild(this.panel.domNode);
      return this.panel.domNode;
    },
    updateDom: function(properties){
      this.domNode.style.width = this.model.properties.width;
      this.domNode.style.height = this.model.properties.height;
    },
    createDndDomNode: function(){
      return this.domNode;
    },
    createMoveContainerDomNode: function(){
      return this.widget.domNode;
    },
    startup: function(){
//      dojo.connect(this.widget.domNode, "onmousedown", this.model, this.model.updatePropertiesView);
//      dojo.connect(this.widget.domNode, "onmousedown", this.model, this.model.updateEventView);
      this.inherited(arguments);
      this.widget.startup();
      this.panel.startup();
      this.updateDom();
    }
  }
);


