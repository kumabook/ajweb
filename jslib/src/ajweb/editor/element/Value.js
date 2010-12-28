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
      var label = that.model.properties.element && that.model.properties.funcName ? 
	that.model.properties.element + ":" + that.model.properties.funcName : "no value"; 
      this.widget =  new dijit.form.Button(
	{ label: label,
	  style: {position: "absolute", top: "0px", left: "0px"
		 },
	  onClick: function(){
	    if(!that.dialog){
	      that.dialog = new dijit.Dialog(
		{ title: label,
		  style: { position: "absolute",
			   height: "300px", width: "400px"}});
	      that.containerNode = that.dialog.containerNode;
	      //エレメント選択

	      var element = that.model.application.getElementByPropId(that.model.properties.element);
	      element = element ? element : (that.model.properties.element ? that.model.properties.element : "");

	      that.elemName = new dijit.layout.ContentPane(
		{ content: "エレメント: ",
		  style: {position: "absolute",top: "30px",left: "10px"}});
	      that.elemSelect = new dijit.form.Select(
		{value: element.properties ? element.properties.id : element,
		 store: that.model.application.getValueStore(that.model), sortByLabel: false,
		 style: {position : "absolute",width: "150px",top: "25px",left: "100px"},
		 onChange: function(value){
		   element = that.model.application.getElementByPropId(that.elemSelect.value);
		   if(element){
		     that.model.properties.element = element.properties.id;
		     that.model.properties.type = "element"; 
		   }
		   else {
		     element = that.elemSelect.value;
		     that.model.properties.element = element;
		     that.model.properties.type = element;
		   }
		   ajweb.editor.getGetterStore(
		     element.properties ? element.properties.tagName : that.elemSelect.value, 
		     that.funcSelect.store);
		   that.funcSelect.set({value: that.model.properties.funcName ? that.model.properties.funcName : ""});
		   that.funcSelect.set({ disabled: false});
		   that.funcButton.set({ disabled: false});
		 }
		});

	      //メソッド
	      that.funcName = new dijit.layout.ContentPane(
		{content: "メソッド名: ",
		 style: { position: "absolute", top: "55px", left: "10px"}});

	      var selectedElemTag = element.properties ? 
		element.properties.tagName : that.model.properties.element;

	      var funcStore = new dojo.data.ItemFileWriteStore({ data: { identifier: "name", label : "name", items: []}});

	      that.funcSelect = new dijit.form.Select(
		{//value: that.model.properties.funcName ? that.model.properties.funcName : "",
		 store: funcStore,//ajweb.editor.getGetterStore(selectedElemTag),
		 style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
		});
	      that.funcButton = new dijit.form.Button(
		{ label: that.model.properties.funcName ? "変更" : "決定",
		  disabled: that.model.properties.element ? false : true,
		  style: {position : "absolute",width: "80px", top: "47px",left: "280px"},
		  onClick: function(){
		    that.model.clearParam();
		    funcStore.fetchItemByIdentity(
		      {identity: that.funcSelect.value,
		       onItem: function(item){
			 that.model.properties.funcName = item.name;
			 that.model.properties.func = item.func ? item.func : null;
			 that.model.properties.property = item.property ? item.property : null;
		       }});
		    that.model.createParam(element.properties ? element.properties.id : element, 
					   that.model.properties.funcName, element);
		    this.set({label: "変更"});
		   //ラベルを変更
		    that.updateDom();
		  }});
	      //引数
	      that.paramContainer = new dijit.layout.ContentPane(
		{ content: "引数",
		  style: {position: "absolute",top: "80px", left: "10px",width: "95%", height: "70%"}});
	      that.dialog.containerNode.appendChild(that.paramContainer.domNode);
	      that.containerNode = that.paramContainer.domNode;

	      
	      if(that.model.properties.element && that.model.properties.funcName)
		that.model.reCreateParamDom();
	      
	      that.dialog.containerNode.appendChild(that.elemSelect.domNode);
	      that.dialog.containerNode.appendChild(that.funcSelect.domNode);
	      
	      that.dialog.containerNode.appendChild(that.elemName.domNode);
	      that.dialog.containerNode.appendChild(that.funcName.domNode);
	      
	      that.dialog.containerNode.appendChild(that.funcButton.domNode);
	      
	      that.elemName.startup();
	      that.funcName.startup();
	      that.elemSelect.startup();
	      that.funcSelect.startup();
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
      this.elemName.destroyRecursive();
      this.funcName.destroyRecursive();
      this.elemSelect.destroyRecursive();
      this.funcSelect.destroyRecursive();
      this.funcButton.destroyRecursive();
      this.paramContainer.destroyRecursive();

      delete this.dialog;
      delete this.elemName;
      delete this.funcName;
      delete this.elemSelect;
      delete this.funcSelect;
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