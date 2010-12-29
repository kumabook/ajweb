dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Item");
dojo.declare("ajweb.editor.element.Item",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Removable],
  /** @lends ajweb.editor.element.Item.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs

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
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var a = ajweb.editor;
      var that = this;
      this.widget =  new dijit.form.Button(
	{ label: "init items",
	  style: {position: "absolute", left: "10px", width: "100px",
		  top: (this.container.containerNode.childNodes.length * 30) + "px"
		 },
	  onClick: function(){
	    if(!that.dialog){
	      that.dialog = new dijit.Dialog(
		{ title: "init items",
		  style: { position: "absolute",
			   height: "300px", width: "400px"}});

	      that.itemContainer = new dijit.layout.ContentPane(
		{ content: "items",
		  style: {position: "absolute", top: "45px", left: "10px",width: "95%", height: "90%", overflow: "auto"}});
	      that.dialog.containerNode.appendChild(that.itemContainer.domNode);
	      that.containerNode = that.itemContainer.domNode;


	      for(var i = 0; i < that.model.children.length; i++){
		that.model.children[i].reCreateDom(that);
	      }

	      that.addDialogStack(that);
	    }
	    that.dialog.show();

	    var parentDialog = that.model.parent.element.dialog;
	    that.dialog._relativePosition = {};
	    that.dialog._relativePosition.x  = parseInt(parentDialog.domNode.style.left) + 300;
	    that.dialog._relativePosition.y  = parseInt(parentDialog.domNode.style.top) - 50;
	    that.dialog.layout();

	    that.dialog.containerNode.style.width = that.dialog.domNode.style.width;
	    that.dialog.containerNode.style.height = that.dialog.domNode.style.height;
	  }
	});
      
      return this.widget.domNode;
    },
    updateDom: function(){
      var label = this.model.properties.element && this.model.properties.funcName ? 
	this.model.properties.element + ":" + this.model.properties.funcName : "no value"; 
      this.widget.set({label: label});
      if(this.dialog)
	this.dialog.set({title: label});
    },
    addDialogStack: function(elem){
      var parentDialogElem = this.model.parent.element;
      if(parentDialogElem.addDialogStack){
	parentDialogElem.addDialogStack(elem);
      }
      else {
	parentDialogElem = this.model.parent.parent.element;
	if(parentDialogElem.addDialogStack){
	  parentDialogElem.addDialogStack(elem);
	}
      }
    },
    removeDialog: function(){
      if(this.dialog){
      this.dialog.destroyRecursive();
      this.itemContainer.destroyRecursive();

      delete this.dialog;
      delete this.itemContainer;      
      }
    },
    removeDom: function(){
      this.widget.destroyRecursive();      
      delete this.widget;
      if(this.dialog)
	this.removeDialog();
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);