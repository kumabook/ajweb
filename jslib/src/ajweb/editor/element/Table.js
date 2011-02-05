dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("ajweb.editor.element.Resizable");
dojo.require("ajweb.widget.Table");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Table");
dojo.declare("ajweb.editor.element.Table", 
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable, 
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Resizable,
	      ajweb.editor.element.Menuable
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
    createDom: function(){
      var properties = this.model.properties;
      this.widget = new dijit.layout.ContentPane(
	{ style: { position: "absolute",
	    top: parseInt(properties.top) + "px", left: parseInt(properties.left) + "px",
	    width: parseInt(properties.width)+this.model.children.length*2+"px", 
		   height: properties.height, border: "solid 1px black"
	  }});
      this.label =  new dijit.layout.ContentPane(
	{content: this.model.tagName+"",
	  style: { position: "absolute",top: "0px", left: "0px" }});
      this.widget.domNode.appendChild(this.label.domNode);
      return this.widget.domNode;
    },
    createContainerNode: function(){
      this.containerWidget = new dijit.layout.ContentPane(
	{ style: {position: "absolute", top: "20px"}});
      this.widget.domNode.appendChild(this.containerWidget.domNode);
      return this.containerWidget.domNode;
    },
    updateDom: function(){
      var properties = this.model.properties;
      this.widget.set(
	{style:{ top: properties.top, left: properties.left, 
		 cssFloat: "left", styleFloat: "left",
		 scroll: "auto",
		 width: parseInt(properties.width)+
		 this.model.children.length*2+"px", height: properties.height}
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