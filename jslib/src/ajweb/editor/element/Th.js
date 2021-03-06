dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Th");
dojo.declare("ajweb.editor.element.Th", 
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Menuable],
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
      this.model.properties._data = this.model.parent.properties.data;
      var width = properties.width;
      if(width=="auto")
	width = "100px";//todo 自動的に計算
//	width = parseInt(this.model.parent.properties.width) - 
      this.widget = new dijit.layout.ContentPane(
	{
	  style:{
	    backgroundColor: "#E1EBFB",border: "dotted 1px #000000",
	    width: width, height: "20px",cssFloat: "left"
	  },
	  content: this.model.properties.label
	});
      return this.widget.domNode;
    },
    updateDom: function(){
      this.widget.set(
	{ style:{width: this.model.properties.width },
	  content: this.model.properties.label
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