dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Init");
dojo.declare("ajweb.editor.element.Init",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.HasDialog],
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
    constructor: function(opt){},
    dialogWidth: "150px",
    dialogHeight: "200px",
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var a = ajweb.editor;
      var that = this;
      this.widget =  new dijit.form.Button(
	{ label: ajweb.resources.initItems,
	  style: {position: "absolute", top: "30px", left: "10px"
	  }
	});
      return this.widget.domNode;
    },
    setDialogPosition: function(){
      this.dialogLeft = 200;
      this.dialogTop = parseInt(this.dialog.domNode.style.top) - 50;
    },
    addOpenDialogEvent: function(){
      dojo.connect(this.widget, "onClick", this, this.openDialog);
    },
    createDialogContents: function(){
      var that = this;
      that.addButton = new dijit.form.Button(
	{ label: ajweb.resources.add,
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
	that.model.children[i].startup();
      }
      that.dialog.containerNode.appendChild(that.addButton.domNode);
      that.addButton.startup();
    },
    updateDom: function(){
/*      var label = this.model.children.length > 0 ?
	"init items( " + this.model.children.length +" )" : "init items";
      this.widget.set({label: label});*/
      if(this.dialog)
	this.dialog.set({title: label});
    },
    removeDom: function(){
      this.widget.destroyRecursive();
      delete this.widget;
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);