dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Predicate");
dojo.declare("ajweb.editor.element.Predicate", 
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable],
  /** @lends ajweb.editor.element.Predicate.prototype */
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
//      this.widget = new dijit.layout.ContentPane(
      this.widget = new dijit.TitlePane(
	{
//	  content: this.model.tagName,
	  title: this.model.tagName,
	  style:{
	    backgroundColor: "#E1EBFB",
	    border: "solid 1px #769DC0"
	  }
	});
      this.paramLeftAccept =  new dijit.layout.ContentPane(
	{
	  content: "left",
	  style:{
	    backgroundColor: "white",
	    border: "dashed 1px #769DC0",
	    left: "20px"
	  }
	});
      this.paramRightAccept =  new dijit.layout.ContentPane(
	{
	  content: "right",
	  style:{
	    backgroundColor: "white",
	    border: "dashed 1px #769DC0",
	    left: "20px"
	  }
	});
      this.widget.hideNode.appendChild(this.paramLeftAccept.domNode);
      this.widget.hideNode.appendChild(this.paramRightAccept.domNode);

      return this.widget.domNode;
    },
    removeDom: function(){
      this.widget.destroyRecursive();
    },
    createMoveTriggerDomNode: function(){
      return this.tablename;
    },
    createDndDomNode: function(){
//      return this.widget.domNode;
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
    onDrop: function(){
      this.inherited(arguments);
      if(this.paramLeftAccept.domNode)
	this.paramLeftAccept.destroy();
      else 
      	this.paramRightAccept.destroy();
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);