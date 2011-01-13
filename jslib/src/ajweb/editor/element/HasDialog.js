dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.TitlePane");
dojo.provide("ajweb.editor.element.HasDialog");
dojo.declare("ajweb.editor.element.HasDialog",
	     null,
  /** @lends ajweb.editor.element.HasDialog.prototype */
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
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {
      this.dialogWidth = ajweb.editor.DIALOG_WIDTH+"px";
      this.dialogHeight = ajweb.editor.DIALOG_HEIGHT+"px";
      this.dialogTop = ajweb.editor.DIALOG_TOP; //こっちは数値
      this.dialogLeft = ajweb.editor.DIALOG_LEFT;
      this.childDialogElems = [];
    },
//    dialogWidth: "365px",
//    dialogHeight: "300px",
//    dialogTop: 100,
//    dialogLeft: 50,
    createDialogContents: function(){
    },
    getDialogTitle: function(){
      return this.model.tagName;
    },
    openDialog: function(operand){
      var that = this;
      var title = that.model.properties.element && that.model.properties.func ?
      that.model.properties.element + ":" + that.model.properties.func : "no func";
//      console.log("OpenDialog");
      if(!that.dialog){
	that.dialog = new dijit.Dialog(
	  {title: this.getDialogTitle(),
	  style: {position: "absolute",height: this.dialogHeight, width: this.dialogWidth},
	  onHide: function(){
	    if(that.getParentDialogElem() == null){//トップダイアログなら子ダイアログをすべて削除
	      that.removeDialog();
	      this.childDialogElems = [];
	    }
	  }
	});
	var parentDialogElem = that.getParentDialogElem();
	if(parentDialogElem){
//	  console.log("add child " + that.model.id);
	  parentDialogElem.childDialogElems.push(that);
	}
	that.containerNode = that.dialog.containerNode;
	that.createDialogContents(arguments);
	that.dialogContentsStartup();
      }

      that.dialog.show();

      that.setDialogPosition();//that.dialogLeft, that.dialogTop);
      that.changeDialogPosition(that.dialogLeft, that.dialogTop);

      that.dialog.containerNode.style.position = "absolute";
      that.dialog.containerNode.style.width = this.dialogWidth;
      that.dialog.containerNode.style.height = this.dialogHeight;


    },
    dialogContentsStartup: function(){
    },
    getParentDialogElem: function(){
      if(this.model.parent.element.openDialog)
	return this.model.parent.element;
      else if(this.model.parent.parent.element && this.model.parent.parent.element.openDialog)
	return this.model.parent.parent.element;
      else
	return null;
    },
    setDialogPosition: function(){
    },
    changeDialogPosition: function(left, top, dialog){
      if(left)
	this.dialogLeft = left;
      if(top)
	this.dialogTop = top;
      if(!dialog)
	dialog = this.dialog;
//      console.log(this.model.id + " top:" + this.dialogTop + "  left: " + this.dialogLeft);
      dialog._relativePosition = {};
      dialog._relativePosition.x  = parseInt(this.dialogLeft);//200;
      dialog._relativePosition.y  = parseInt(this.dialogTop);//parseInt(that.dialog.domNode.style.top) - 50;
      dialog.layout();
    },
    addOpenDialogEvent: function(){
//      console.log("addOpenDialogEvent");
      dojo.connect(this.widget, "onDblClick", this, this.openDialog);
    },
    removeDialog: function(){
  //    console.log(this.model.id + " removeDialog"  + this.childDialogElems.length);
      for(var i = 0; i < this.childDialogElems.length; i++){
	this.childDialogElems[i].removeDialog();
      }
      if(this.dialog)
	this.dialog.destroyRecursive();
      delete this.dialog;
    },
    startup: function(){
      this.inherited(arguments);
      this.addOpenDialogEvent();
      var that = this;
    }
  }
);




