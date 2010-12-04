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
	  doLayout: false,
	  onClose: function(){
	    that.model.clearPropertiesView();
	    that.model.clearEventView();
	    for(var i = 0; i < that.model.children.length; i++){
	      that.model.children[i].removeDom();
	    }
	    return true;
	  }
	});
      this.panel = new dijit.layout.ContentPane(
	{
	  id : this.id+ "_panel",
	  style:{
	    position: "absolute",
	    border: "dashed 1px black"
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
      this.model.top = top > 0 ?  top : 2;
      this.model.left = left > 0 ? left : 2;
      this.panel.domNode.style.width = parseInt(this.model.properties.width) + "px";
      this.panel.domNode.style.height = parseInt(this.model.properties.height) + "px";
      this.panel.domNode.style.top = parseInt(this.model.top) + "px";
      this.panel.domNode.style.left = parseInt(this.model.left) + "px";
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