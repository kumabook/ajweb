dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("ajweb.editor.element.Resizable");
dojo.require("ajweb.widget.Table");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Table");
dojo.declare("ajweb.editor.element.Table", 
	     [ajweb.editor.element.Element,
//	      ajweb.editor.element.DndEnable, 
	      ajweb.editor.element.Movable
//	      ajweb.editor.element.Resizable
	     ],
  /** @lends ajweb.editor.element.Widget.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs
     * @borrows ajweb.editor.element.Element#id this.id
     * @borrows ajweb.editor.element.Element#model this.model
     * @borrows ajweb.editor.element.Element#container this.container
     * @borrows ajweb.editor.element.Element#domNode this.domNode
     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {ajweb.editor.model.Model} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {},
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      this.widget = new dijit.layout.ContentPane(
	{content: this.id,
	  style: {
	    position: "absolute",
	    top: parseInt(properties.top) + "px", left: parseInt(properties.left) + "px",
	    width: properties.width,
	    height: properties.height,
	    border: "dashed 1px black"
	  }});
      return this.widget.domNode;
    },
    updateDom: function(properties){
      this.widget.set(
	{
	  style:{
	    top: properties.top,
	    left: properties.left,
	    border: "dashed 1px black"
	  },
	  label: properties.content
	});
    },
    removeDom: function(){
      this.widget.destroyRecursive();
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);