dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Database");
dojo.declare("ajweb.editor.element.Database",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Removable],
  /** @lends ajweb.editor.element.Database.prototype */
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
      if(!properties.tablename)
	properties.tablename = this.id;
      this.widget = new dijit.layout.ContentPane(
	{
	  style:{
	    position: "absolute",
	    width: ajweb.editor.DATABASE_WIDTH+"px",
	    height: ajweb.editor.DATABASE_INIT_HEIGHT+"px",
	    top: properties.top,
	    left: properties.left,
	    backgroundColor: "#E1EBFB",
	    border: "solid 1px #769DC0"
	  }
	});
      this.tablename = document.createElement("div");
      this.tablename.className = "dijitDialogTitleBar";
      this.tablename.innerHTML  = properties.tablename;
      this.widget.domNode.appendChild(this.tablename);
      return this.widget.domNode;
    },
    updateDom: function(){
      this.widget.set({
	style:{
	    top: this.model.properties.top,
	    left: this.model.properties.left
	  }
	});
      this.tablename.innerHTML  = this.model.properties.tablename;
      this.domNode.style.height = (this.model.children.length) * ajweb.editor.DATABASE_PROP_HEIGHT + 35 + "px";
    },
    removeDom: function(){
      this.widget.destroyRecursive();
    },
    createMoveTriggerDomNode: function(){
      return this.tablename;
    },
    createDndDomNode: function(){
      return this.domNode;
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);


