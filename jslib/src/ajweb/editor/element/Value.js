dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Value");
dojo.declare("ajweb.editor.element.Value",
	     [ajweb.editor.element.Element],
  /** @lends ajweb.editor.element.Value.prototype */
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
      that.dialogStack = [];
      var label = that.model.properties._label ? 
	that.model.properties._label : that.model.tagName;
      this.widget =  new dijit.form.Button(
	{ label: label,
	  style: {position: "absolute", top: "0px", left: "0px"
		 // width: (title.length*a.FONTSIZE)+a.REMOVEICONSIZE+"px"
		 },
	  onClick: function(){
	    if(!that.dialog){
	      that.dialog = new dijit.Dialog(
		{ title: label,
		  style: { position: "absolute",
			   height: "300px", width: "400px"}});
	      that.containerNode = that.dialog.containerNode;
	      //エレメント選択
	      that.element = that.model.application.getElementByPropId(that.model.properties.element);
	      if(!that.element)
		that.element = that.model.properties.element ? that.model.properties.element : "";

	      that.elemName = new dijit.layout.ContentPane(
		{ content: "エレメント: ",
		  style: {position: "absolute",top: "30px",left: "10px"}});

	      that.elemSelect = new dijit.form.Select(
		{	name: "modelId", 
			value: that.element.id ? that.element.id : that.element,
			store: that.model.application.getValueStore(that.model), sortByLabel: false,
			style: {position : "absolute",width: "150px",top: "25px",left: "100px"}
		});
//	      that.elemSelect._setValueAttr(that.element.id ? that.element.id : that.element);
	      that.elemButton = new dijit.form.Button(
		{ label: that.model.properties.element ? "変更" : "決定",
		  style: {position : "absolute",width: "80px", top: "22px",left: "280px"},
		  onClick: function(){
		    that.element = ajweb.getModelById(that.elemSelect.value);
		    if(that.element){
		      that.model.properties.element = that.element.properties.id;
		      that.model.properties.type = "element"; 
		    }

		    else {
		      that.element = that.elemSelect.value;
		      that.model.properties.element = that.elemSelect.value; // int, stringなどの基本型
		      that.model.properties.type = that.elemSelect.value; 
		    }
		    
		    ajweb.editor.updateGetterStore(
		      that.element.properties ? that.element.properties.tagName : that.elemSelect.value, 
		      that.funcSelect.store);

		    that.funcSelect.set({ disabled: false});
		    that.funcButton.set({ disabled: false});
		    this.set({label: "変更"});



		  }});

	      //メソッド
	      that.funcName = new dijit.layout.ContentPane(
		{content: "メソッド名: ",
		 style: { position: "absolute", top: "55px", left: "10px"}});

	      var selectedElemTag = that.element.properties ? 
		that.element.properties.tagName : that.model.properties.element;

	      var funcStore = ajweb.editor.getGetterStore(selectedElemTag);


	      that.funcSelect = new dijit.form.Select(
		{	name: "modelId", 
			value: that.model.properties.func ? that.model.properties.func : "",
			store: funcStore,//ajweb.editor.getGetterStore(selectedElemTag),
			style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
		});
	      that.funcButton = new dijit.form.Button(
		{ label: that.model.properties.func ? "変更" : "決定",
		  disabled: that.model.properties.element ? false : true,
		  style: {position : "absolute",width: "80px", top: "47px",left: "280px"},
		  onClick: function(){
		    that.model.clearParam();
		    that.model.properties.func = that.funcSelect.value;
		    that.model.createParam(that.element.id ? that.element.id : that.element, 
					   that.model.properties.func, that.element);
		    this.set({label: "変更"});

		    //ラベルを変更
		    that.model.properties._label = that.model.properties.element + ":" + that.model.properties.func;
		    var label = that.model.properties._label;
		    that.widget.set({label: label});
		  }});
	      //引数
	      that.paramContainer = new dijit.layout.ContentPane(
		{ content: "引数",
		  style: {position: "absolute",top: "80px", left: "10px",width: "95%", height: "70%"}});
	      that.dialog.containerNode.appendChild(that.paramContainer.domNode);
	      that.containerNode = that.paramContainer.domNode;

	      
	      if(that.model.properties.element && that.model.properties.func)
		that.model.reCreateParamDom();
	      
	      that.dialog.containerNode.appendChild(that.elemSelect.domNode);
	      that.dialog.containerNode.appendChild(that.funcSelect.domNode);
	      
	      that.dialog.containerNode.appendChild(that.elemName.domNode);
	      that.dialog.containerNode.appendChild(that.funcName.domNode);
	      
	      that.dialog.containerNode.appendChild(that.elemButton.domNode);
	      that.dialog.containerNode.appendChild(that.funcButton.domNode);
	      
	      that.elemName.startup();
	      that.funcName.startup();
	      that.elemSelect.startup();
	      that.funcSelect.startup();
	      that.elemButton.startup();
	      that.funcButton.startup();

	      that.addDialogStack(that);
		
	    }
	    that.dialog.show();

	    that.parentDialog = that.model.parent.parent.element.dialog;
	    that.dialog._relativePosition = {};
	    that.dialog._relativePosition.x  = parseInt(that.parentDialog.domNode.style.left) + 300;
	    that.dialog._relativePosition.y  = parseInt(that.parentDialog.domNode.style.top) - 50;
	    that.dialog.layout();

	    that.dialog.containerNode.style.width = that.dialog.domNode.style.width;
	    that.dialog.containerNode.style.height = that.dialog.domNode.style.height;
	  }
	});

      var tagName = this.model.parent.tagName;
      if(tagName == "eq" || tagName == "gt" || tagName == "lt")
	this.widget.set({style: {position: "absolute",
				 left: (this.container.containerNode.childNodes.length-1) * 120 + "px"}});
      
      return this.widget.domNode;
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
      this.elemName.destroyRecursive();
      this.funcName.destroyRecursive();
      this.elemSelect.destroyRecursive();
      this.funcSelect.destroyRecursive();
      this.elemButton.destroyRecursive();
      this.funcButton.destroyRecursive();
      this.paramContainer.destroyRecursive();

      delete this.dialog;
      delete this.elemName;
      delete this.funcName;
      delete this.elemSelect;
      delete this.funcSelect;
      delete this.elemButton;
      delete this.funcButton;
      delete this.paramContainer;      
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