dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Init");
dojo.declare("ajweb.editor.element.Init",
	     [ajweb.editor.element.Element],
  /** @lends ajweb.editor.element.Init.prototype */
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
    {
     this.dialogStack = [];
    },
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var a = ajweb.editor;
      var that = this;
      this.widget =  new dijit.form.Button(
	{ label: "init items",
	  style: {position: "absolute", top: "30px", left: "10px"
		 },
	  onClick: function(){
	    if(!that.dialog){
	      that.dialog = new dijit.Dialog(
		{ title: "init items",
		  style: { position: "absolute",
			   height: 130 + that.model.children.length * 30 + "px",
			   width: "150px"},
		  onHide: function(){
		   for(var i = 0; i < that.dialogStack.length; i++){
		     that.dialogStack[i].removeDialog();
		   }
		   that.removeDialog();
		   that.dialogStack = [];
		  }
		});
	   
	      that.addButton = new dijit.form.Button(
		{ label: "追加",
		  style: {position : "absolute", top: "45px",left: "25px"},
		  onClick: function(){
		    that.model.createItem();
		    that.dialog.set({style: {height: 130 + that.model.children.length * 30 + "px"}});
		    that.dialog.containerNode.style.height = that.dialog.domNode.style.height;
		   //ラベルを変更
//		    that.updateDom();
		  }});
	      //引数
	      that.itemContainer = new dijit.layout.ContentPane(
		{ content: "items",
		  style: {position: "absolute",top: "80px", left: "10px", width: "95%", height: "100%", overflow: "auto"}});
	      that.dialog.containerNode.appendChild(that.itemContainer.domNode);
	      that.containerNode = that.itemContainer.domNode;

	      
	      for(var i = 0; i < that.model.children.length; i++){
		that.model.children[i].reCreateDom(that);
	      }

	      that.dialog.containerNode.appendChild(that.addButton.domNode);
	      that.addButton.startup();
	    }
	    that.dialog.show();

	    that.dialog._relativePosition = {};
	    that.dialog._relativePosition.x  = 200;
	    that.dialog._relativePosition.y  = parseInt(that.dialog.domNode.style.top) - 50;
	    that.dialog.layout();

	    that.dialog.containerNode.style.width = that.dialog.domNode.style.width;
	    that.dialog.containerNode.style.height = that.dialog.domNode.style.height;
	  }
	});
      
      return this.widget.domNode;
    },
    updateDom: function(){
      var label = this.model.children.length > 0 ? 
	"init items( " + this.model.children.length +" )" : "init items";
      this.widget.set({label: label});
      if(this.dialog)
	this.dialog.set({title: label});
    },
    addDialogStack: function(elem){
      this.dialogStack.push(elem);
    },
    removeDialog: function(){
      if(this.dialog){
      this.dialog.destroyRecursive();
      this.addButton.destroyRecursive();
      this.itemContainer.destroyRecursive();

      delete this.dialog;
      delete this.addButton;
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