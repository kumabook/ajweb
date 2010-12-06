dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Widget");
dojo.declare("ajweb.editor.element.Widget",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Movable
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
	{
	  style:{
	    position: "absolute",
	    backgroundColor: "#E1EBFB",
	    border: "dotted 1px #000000",
	    top: properties.top,
	    left: properties.left,
	    width: properties.width,
	    height: properties.height
	  },
	  content: this.model.tagName
	});
      return this.widget.domNode;
    },
    updateDom: function(properties){
      this.widget.set(
	{
	  style:{
	    top: properties.top,
	    left: properties.left
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


