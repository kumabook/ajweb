dojo.require("ajweb.editor.element.Element");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.PredicateOperator");
dojo.declare("ajweb.editor.element.PredicateOperator",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.HasDialog],
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
      var that = this;
      var operandLeft = "70px";
      this.widget = new dijit.layout.ContentPane(
	{ style: { position: "absolute", width: "300px", height: "130px",
		   top: "100px", left: "0px" }});
      var operator = new dijit.layout.ContentPane(
	{ content: ajweb.editor.conditionToOperator(that.model.tagName),
	  style: { position: "absolute", height: "40px", fontSize: "15px",
		   top: "35px", left: "75px" }});
      this.leftButton = new dijit.form.Button(
	{ label: "condition",
	  style: {position : "absolute",top: "0px",left: operandLeft}
	});

      this.rightButton = new dijit.form.Button(
	{ label: "condition",
	  style: {position : "absolute", top: "70px", left: operandLeft}
	});

      this.widget.domNode.appendChild(operator.domNode);
      this.widget.domNode.appendChild(this.leftButton.domNode);
      this.widget.domNode.appendChild(this.rightButton.domNode);
      return this.widget.domNode;
    },
    openDialog: function(operand){
      var that = this;
      var title = that.model.properties.element && that.model.properties.func ?
      that.model.properties.element + ":" + that.model.properties.func : "no func";

      if(!that[operand+"dialog"]){
	that[operand+"dialog"] = new dijit.Dialog(
	  {title: title,
	  style: {position: "absolute",height: this.dialogWidth, width: this.dialogHeight},
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
	that.containerNode = that[operand+"dialog"].containerNode;
	that.createDialogContents(that[operand+"dialog"], operand);
      }

      that[operand+"dialog"].show();
      that.dialog = that[operand+"dialog"];
      that.setDialogPosition(operand);//that.dialogLeft, that.dialogTop);
      that.changeDialogPosition(that.dialogLeft, that.dialogTop, that[operand+"dialog"]);

      that[operand+"dialog"].containerNode.style.width = that[operand+"dialog"].domNode.style.width;
      that[operand+"dialog"].containerNode.style.height = that[operand+"dialog"].domNode.style.height;
    },
    removeDialog: function(){
//      console.log(this.model.id + " removeDialog"  + this.childDialogElems.length);
      for(var i = 0; i < this.childDialogElems.length; i++){
	this.childDialogElems[i].removeDialog();
      }
      if(this.leftdialog)
	this.leftdialog.destroyRecursive();
      if(this.rightdialog)
	this.rightdialog.destroyRecursive();
      delete this.leftdialog;
      delete this.rightdialog;
    },
    getParentDialogElem: function(){
      return this.model.parent.element;
    },
    addOpenDialogEvent: function(){
//      console.log("addOpenDialogEvent");
      dojo.connect(this.leftButton, "onClick", this, function(){
		     this.openDialog("left");
		   });
      dojo.connect(this.rightButton, "onClick", this, function(){
		     this.openDialog("right");
		   });
    },
    setDialogPosition: function(){
      var parentDialog = this.getParentDialogElem().dialog;
      this.dialogLeft =	parseInt(parentDialog.domNode.style.left) + 50;
      this.dialogTop =	parseInt(parentDialog.domNode.style.top) + 50;
    },
    createDialogContents: function(dialog, operand){
      var that = this;

      this.predictName = new dijit.layout.ContentPane(
	{content: ajweb.resources.conditionSelect,
	 style: {position: "absolute",top: "45px", left: "10px"}});
      this.predictSelect = new dijit.form.Select(
	{value: that.model.properties[operand] ? that.model.properties[operand] : "",
	 store: ajweb.editor.conditionOperatorStore, sortByLabel: false,
	 style: {position : "absolute",width: "150px",top: "40px",left: "70px"}
      });
      this.button = new dijit.form.Button(
	{ label: ajweb.resources.select,
	style: {position : "absolute", top: "40px",left: "250px"},
	onClick: function(){
	  that.containerNode = dialog.containerNode;
	  if(that.model.children.length == 0){
	    var tagName = this.predictSelect.value;
	    that.model.properties[operand] = this.predictSelect.value;
	    var newModel = that.model.editor.newModel(tagName, {}, that.model, that);
	      newModel.properties.name = tagName;
	    if(tagName == "eq" || tagName == "gt" || tagName == "lt"){
	      that.model.editor.newModel("value", {}, newModel, newModel.element);
	      that.model.editor.newModel("value", {}, newModel, newModel.element);
	    }
	  }
	}
      });
      dialog.containerNode.appendChild(this.predictName.domNode);
      dialog.containerNode.appendChild(this.predictSelect.domNode);
      dialog.containerNode.appendChild(this.button.domNode);;
      this.predictName.startup();
      this.predictSelect.startup();
      this.button.startup();
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