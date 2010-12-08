dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.PredicateOperator");
dojo.declare("ajweb.editor.element.PredicateOperator", 
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable],
  /** @lends ajweb.editor.element.PredicateOperator.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs
     * @borrows ajweb.editor.element.Element#id this.id
     * @borrows ajweb.editor.element.Element#model this.model
     * @borrows ajweb.editor.element.Element#title this.title
     * @borrows ajweb.editor.element.Element#container this.container
     * @borrows ajweb.editor.element.Element#domNode this.domNode
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
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      this.widget = new dijit.TitlePane(
	{
	 title: this.id,
	  style:{
//	    position: "absolute",
//	    width: "240px",
//	    height: "40px",
//	    top: properties.top,
//	    left: properties.left,
	    backgroundColor: "#E1EBFB",
	    border: "solid 1px #769DC0"
	  }
	});
      return this.widget.domNode;
    },
    removeDom: function(){
      this.widget.destroyRecursive();
    },
    createMoveTriggerDomNode: function(){
      return this.tablename;
    },
    createDndDomNode: function(){
      return this.widget.hideNode;
    },
    checkAcceptance: function(){
      if(this.model.tagName == "not" && this.model.children.length > 0)
	return false;
      else if(this.model.children.length > 1)
	return false; 
      else 
	return this.inherited(arguments);
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);