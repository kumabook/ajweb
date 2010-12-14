dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Resizable");
dojo.require("ajweb.editor.element.Menuable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Panel");
dojo.declare("ajweb.editor.element.Panel",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Menuable,
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
      this.widget.modelId = this.model.id;
      this.panel = new dijit.layout.ContentPane(
	{
	  style:{
	    position: "absolute",
	    border: "dashed 1px black"
	  }
	});
      this.widget.domNode.appendChild(this.panel.domNode);
      return this.panel.domNode;
    },
    removeDom: function(){     
      this.model.editor.centerTc.removeChild(this.widget);
      this.widget.destroyRecursive();
    },
    createMenu: function(){
      var that = this;
      var menu = new dijit.Menu();
      menu.addChild(new dijit.MenuItem({label: "右クリックメニュー" }));
      menu.addChild(new dijit.MenuItem({label: "削除", 
					disabled: this.model.properties.id == "rootPanel" ? true: false,
					onClick: function(){
					  that.model.remove();
					}}));
      return menu;
    },
    updateDom: function(){

      var top =  (parseInt(this.widget.domNode.style.height) -
		  parseInt(this.model.properties.height)) / 2;
      var left = (parseInt(this.widget.domNode.style.width) -
		  parseInt(this.model.properties.width)) / 2;
      this.model.properties.top = top > 0 ?  top : 2;
      this.model.properties.left = left > 0 ? left : 2;
      this.panel.domNode.style.width = parseInt(this.model.properties.width) + "px";
      this.panel.domNode.style.height = parseInt(this.model.properties.height) + "px";
      this.panel.domNode.style.top = parseInt(this.model.properties.top) + "px";
      this.panel.domNode.style.left = parseInt(this.model.properties.left) + "px";
      this.widget.set({title: this.model.properties.id});
      
      this.model.editor.updateProjectTree(this.model);
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