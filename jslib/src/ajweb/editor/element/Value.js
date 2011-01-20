dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Value");
dojo.declare("ajweb.editor.element.Value",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.HasDialog],
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
    createDom: function(){
      var a = ajweb.editor;
      var that = this;
      var top = that.model.properties.top ? that.model.properties.top : "0px";
      var left = that.model.properties.left ? that.model.properties.left : "0px";
      var label = (that.model.properties.element && that.model.properties.funcName) ?
	that.model.properties.element + a.METHOD_SEPARATOR + that.model.properties.funcName : "no value";
      this.widget =  new dijit.form.Button(
	{ label: label,
	  style: {position: "absolute", top: top, left: left
	}
      });

      return this.widget.domNode;
    },
    setDialogPosition: function(){
      var parentDialog = this.getParentDialogElem().dialog;
      this.dialogLeft = parseInt(parentDialog.domNode.style.left) + 50;
      this.dialogTop = parseInt(parentDialog.domNode.style.top) + 25;
    },
    getParentDialogElem: function(){
      if(this.model.parent.element.openDialog)
	return this.model.parent.element;
      else// if(this.model.parent.parent.element.dialog)
	return this.model.parent.parent.element;
    },
    dialogContentsStartup: function(){

      this.elemName.startup();
      this.funcName.startup();
      alert("startup");
      this.elemSelect.startup();
      this.funcSelect.startup();
      this.funcButton.startup();
    },
    createDialogContents: function(){
      var that = this;
      that.containerNode = that.dialog.containerNode;
      //エレメント選択
      that.element = that.model.application.getElementByPropId(that.model.properties.element);
      that.element = that.element ? that.element : (that.model.properties.element ? that.model.properties.element : "");
      that.elemName = new dijit.layout.ContentPane(
	{ content: ajweb.resources.elementSelect,
	  style: {position: "absolute",top: "30px",left: "10px"}});
      that.elemSelect = new dijit.form.Select(
	{value: that.element.properties ? that.element.properties.id : that.element,
	 store: that.model.application.getValueStore(that.model), sortByLabel: false,
	 style: {position : "absolute", width: "150px", top: "25px",left: "100px"},
	 onChange: function(value){
	   that.element = that.model.application.getElementByPropId(that.elemSelect.value);
	   ajweb.editor.getGetterStore(
	     that.element ? that.element.properties.tagName : that.elemSelect.value,
	     that.funcSelect.store);
	   that.funcSelect.set({value: that.model.properties.func ? that.model.properties.func : ""});
	   that.funcSelect.set({ disabled: false});
	   that.funcButton.set({ disabled: false});
	 }
	});

      //メソッド
      that.funcName = new dijit.layout.ContentPane(
	{content: ajweb.resources.methodSelect,
	 style: { position: "absolute", top: "55px", left: "10px"}});
      

      that.funcSelect = new dijit.form.Select(
	{
	store: ajweb.editor.getGetterStore(),
	style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
	  });
      that.funcButton = new dijit.form.Button(
	{ label: that.model.properties.funcName ? ajweb.resources.change : ajweb.resources.enter,
	  disabled: that.model.properties.element ? false : true,
	  style: {position : "absolute",width: "80px", top: "47px",left: "280px"},
	  onClick: function(){
	    that.model.clearParam();
	    that.model.properties.element = that.element ? that.element.properties.id : that.elemSelect.value;

	    that.funcSelect.store.fetchItemByIdentity(
	      {identity: that.funcSelect.value,
	      onItem: function(item){
//		console.log("funcName: " + item.name + "funcValue: " + item.label);
		that.model.properties.func = that.funcSelect.store.getValue(item, "name");
		that.model.properties.funcName = that.funcSelect.store.getValue(item, "label");

	      }});
	    that.model.createParam(that.element ? that.element.properties.id : that.elemSelect.value,
				   that.model.properties.func, that.element);
	    this.set({label: ajweb.resources.change});
	    //ラベルを変更
//	    that.model.setRefProperty();
//	    that.model.updateDom();
	    that.model.update();
	  }});
      //引数
      that.paramContainer = new dijit.layout.ContentPane(
	{ content: ajweb.resources.param,
      style: {position: "absolute", overflow: "visible",
	      top: ajweb.editor.PARAM_CONTAINER_TOP+"px", left: ajweb.editor.PARAM_CONTAINER_LEFT+"px",
	      width: parseInt(this.dialog.style.width)-ajweb.editor.PRAM_CONTAINER_LEFT+"px", 
	      height: parseInt(this.dialog.style.height)-ajweb.editor.PRAM_CONTAINER_TOP+"px"}});
      that.dialog.containerNode.appendChild(that.paramContainer.domNode);
      that.containerNode = that.paramContainer.domNode;


      if(that.model.properties.element && that.model.properties.funcName)
	that.model.reCreateParamDom();

      that.dialog.containerNode.appendChild(that.elemSelect.domNode);
      that.dialog.containerNode.appendChild(that.funcSelect.domNode);

      that.dialog.containerNode.appendChild(that.elemName.domNode);
      that.dialog.containerNode.appendChild(that.funcName.domNode);

      that.dialog.containerNode.appendChild(that.funcButton.domNode);

      that.updateDom();
    },
    addOpenDialogEvent: function(){
      dojo.connect(this.widget, "onClick", this, this.openDialog);
    },
    updateDom: function(){
      var a = ajweb.editor;
      var label = (this.model.properties.element && this.model.properties.funcName) ?
	this.model.properties.element + a.METHOD_SEPARATOR + this.model.properties.funcName : "no value";
      this.widget.set({label: label});
      if(this.model.parent.tagName == "param")
	label = this.model.parent.properties.name + a.PARAM_SEPARATOR + label;
      else 
	label = this.model.parent.tagName + a.PARAM_SEPARATOR + label;
      if(this.dialog){
	this.dialog.set({title: label});
	this.dialog.layout();
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
