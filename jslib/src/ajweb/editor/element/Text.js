dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("ajweb.editor.element.Menuable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Text");
dojo.declare("ajweb.editor.element.Text",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Menuable,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Resizable
	     ],
  /** @lends ajweb.editor.element.Button.prototype */
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
	    border: "solid 1px #000000",
	    top: parseInt(this.model.properties.top)+"px", left: parseInt(this.model.properties.left)+"px",
	    width: parseInt(this.model.properties.width)+"px", height: parseInt(this.model.properties.height)+"px"
//	    top: properties.top,
//	    left: properties.left
	  },
	  content: properties.content
	});
      return this.widget.domNode;
    },
    updateDom: function(){
      this.widget.set(
	{style:{
	   top: parseInt(this.model.properties.top)+"px", left: parseInt(this.model.properties.left)+"px",
	   width: parseInt(this.model.properties.width)+"px", height: parseInt(this.model.properties.height)+"px"
	 }
//	  content: this.model.properties.content
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


