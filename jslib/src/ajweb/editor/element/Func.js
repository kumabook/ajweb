dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("ajweb.editor.element.HasDialog");
dojo.require("dijit.TitlePane");
dojo.provide("ajweb.editor.element.Func");
dojo.declare("ajweb.editor.element.Func",
	     [
	       ajweb.editor.element.Element,
	       ajweb.editor.element.DndEnable,
	       ajweb.editor.element.Movable,
	       ajweb.editor.element.Removable,
	       ajweb.editor.element.HasDialog
	     ],
  /** @lends ajweb.editor.element.Func.prototype */
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
    constructor: function(opt){
      this.model.parent.element.addNewNode(this.domNode);
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      var that = this;
      var a = ajweb.editor;
      var title = that.model.properties.element && that.model.properties.func ?
	that.model.properties.element + ":" + that.model.properties.func : "no func";
       this.widget = new dijit.TitlePane(
	{ title: title,
	  open: false, toggleable: false,
	  style:{position: "absolute", width: title.length*a.FONT_SIZE+a.REMOVE_ICON_SIZE+"px",
		 top: properties.top, left: properties.left,
		 backgroundColor: "#E1EBFB",border: "solid 1px #769DC0" }
	});

      this.widget.element = this;
      //ドロップ要素を更新
      if(this.model.parent.element)
	this.model.parent.element.widget.set(
	  { style: {
	      top: this.model.parent.properties.top,
	      left: parseInt(this.model.parent.properties.left) + 250 + "px"
	    }
	  });
      return this.widget.domNode;
    },
    dialogContentsStartup: function(){
      this.elemSelect.startup();
      this.funcSelect.startup();
      this.elemName.startup();
      this.funcName.startup();
      this.funcButton.startup();
    },
    createDialogContents: function(){
      var that = this;
      that.paramContainer = new dijit.layout.ContentPane(
	{ content: ajweb.resources.param,
	  style: {position: "absolute",top: "80px", left: "10px",
		  width: this.dialog.style.width, height: this.dialog.style.height}
	});
      that.dialog.containerNode.appendChild(that.paramContainer.domNode);
      that.containerNode = that.paramContainer.domNode;

      var element = that.model.application.getElementByPropId(that.model.properties.element);
      element = element ? element : that.model.properties.element;

      that.elemName = new dijit.layout.ContentPane(
	{ content: "エレメント名: ",
	style: {position: "absolute",top: "30px",left: "10px"}});
      that.elemSelect = new dijit.form.Select(
	{ value: element ? element.properties.id: null,
	store: that.model.application.getWidgetStore(), sortByLabel: false,
	style: {position : "absolute",width: "150px",top: "25px",left: "100px"},
	onChange: function(value){
	  element = that.model.application.getElementByPropId(value);
	  that.model.properties.element = element ? element.properties.id : null;
	  ajweb.editor.getFuncStore(element.properties.tagName, that.funcSelect.store);
	  that.funcSelect.set({disabled: false, value: that.model.properties.func ? that.model.properties.func : null});
	  that.funcButton.set({disabled: false});
	}
	});

      that.funcName = new dijit.layout.ContentPane(
	{content: ajweb.resources.methodSelect,
	style: { position: "absolute", top: "55px", left: "10px"}});

      var selectedElemTag = element ? element.properties.tagName : "";
      that.funcSelect = new dijit.form.Select(
	{ //value: that.model.properties.func ? that.model.properties.func : "",
	store: ajweb.editor.getFuncStore(selectedElemTag),
	sortByLabel: false, disabled: that.model.properties.element ? false : true,
	style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
	});
      that.funcButton = new dijit.form.Button(
	{ label: that.model.properties.func ? ajweb.resources.change : ajweb.resources.enter,
	disabled: that.model.properties.element ? false : true,
	style: {position : "absolute",width: "80px", top: "47px",left: "280px"},
	onClick: function(){
	  that.model.clearParam();
	  that.model.properties.func = that.funcSelect.value;
	  that.model.createParam(element.properties.id, that.model.properties.func);
	  this.set({label: ajweb.resources.change});
	  //ラベルを変更
	  that.updateDom();

	  that.container.reDrawChildNode(that.domNode);
	}});
      if(that.model.properties.element && that.model.properties.func)
	that.model.reCreateParamDom();
      that.dialog.containerNode.appendChild(that.elemSelect.domNode);
      that.dialog.containerNode.appendChild(that.funcSelect.domNode);
      that.dialog.containerNode.appendChild(that.elemName.domNode);
      that.dialog.containerNode.appendChild(that.funcName.domNode);
      that.dialog.containerNode.appendChild(that.funcButton.domNode);
    },
    updateDom: function(){
      var a = ajweb.editor;
      var title = this.model.properties.element && this.model.properties.func ?
	this.model.properties.element + ":" + this.model.properties.func : "no func";
      this.widget.set({
	title: title,
	style:{
	  top: this.model.properties.top,
	  left: this.model.properties.left,
	  width: title.length*a.FONT_SIZE+a.REMOVE_ICON_SIZE+"px"
	  }
	});
      if(this.dialog)
	this.dialog.set({title: title});
    },
    removeDom: function(){
      this.container.removeNode(this.domNode);
      this.widget.destroyRecursive();
    },
    createMoveTriggerDomNode: function(){
      return this.domNode;
    },
    onDrop: function(){
      this.inherited(arguments);
    },
    startup: function(){
      this.inherited(arguments);
      var that = this;
      this.widget.startup();
//      this.model.parent.element.addNewNode(this.domNode);
    }
  }
);


