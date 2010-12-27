dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dojox.widget.Dialog");
dojo.require("dijit.TitlePane");
dojo.provide("ajweb.editor.element.Func");
dojo.declare("ajweb.editor.element.Func",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Removable],
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
    constructor: function(opt)
    {
      this.dialogStack = [];
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      var that = this;
      var a = ajweb.editor;
      var title = this.model.properties._title ? this.model.properties._title : this.model.tagName;
       this.widget = new dijit.TitlePane(
	{ title: title,
	  open: false, toggleable: false,
	  style:{position: "absolute", width: title.length*a.FONTSIZE+a.REMOVEICONSIZE+"px", 
		 top: properties.top, left: properties.left,
		 backgroundColor: "#E1EBFB",border: "solid 1px #769DC0" },
	  onDblClick: function(){
	    if(!that.dialog){
	      that.dialog = new dijit.Dialog(
		{title: that.model.tagName,
		 style: {position: "absolute",height: "300px", width: "400px"},
		 onHide: function(){
		   delete that.store;

		   for(var i = 0; i < that.dialogStack.length; i++){
		     that.dialogStack[i].removeDialog();
		   }
		   that.removeDialog();
		   that.dialogStack = [];
		 }
		});
	      that.paramContainer = new dijit.layout.ContentPane(
		{ content: "引数",
		  style: {position: "absolute",top: "80px", left: "10px",width: "95%", height: "70%"}});
	      that.dialog.containerNode.appendChild(that.paramContainer.domNode);
	      that.containerNode = that.paramContainer.domNode;
	      
	      that.element = that.model.application.getElementByPropId(that.model.properties.element);
	      
	      that.elemName = new dijit.layout.ContentPane(
		{ content: "エレメント名: ",
		  style: {position: "absolute",top: "30px",left: "10px"}});
	      that.elemSelect = new dijit.form.Select(
		{	name: "modelId", value: that.element ? that.element.id: "",
			store: that.model.application.getWidgetStore(), sortByLabel: false,
			style: {position : "absolute",width: "150px",top: "25px",left: "100px"}
		});
	      that.elemButton = new dijit.form.Button(
		{ label: that.model.properties.element ? "変更" : "決定",
		  style: {position : "absolute",width: "80px", top: "22px",left: "280px"},
		  onClick: function(){
		    that.element = ajweb.getModelById(that.elemSelect.value);
		    that.model.properties.element = that.element ? that.element.properties.id : null;		  
		    ajweb.editor.updateFuncStore(that.element.properties.tagName, that.funcSelect.store);
		    that.funcSelect.set({disabled: false});
		    that.funcButton.set({disabled: false});
		    this.set({label: "変更"});
		  }});
	      that.funcName = new dijit.layout.ContentPane(
	      {content: "メソッド名: ",
	       style: { position: "absolute", top: "55px", left: "10px"}});
	      
	      var selectedElemTag = that.element ? that.element.properties.tagName : "";
	      that.funcSelect = new dijit.form.Select(
		{	name: "name", value: that.model.properties.func ? that.model.properties.func : "",
			store: ajweb.editor.getFuncStore(selectedElemTag),
			sortByLabel: false, disabled: that.model.properties.element ? false : true,
			style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
		});
	      that.funcButton = new dijit.form.Button(
		{ label: that.model.properties.func ? "変更" : "決定", 
		  disabled: that.model.properties.element ? false : true,
		  style: {position : "absolute",width: "80px", top: "47px",left: "280px"},		
		  onClick: function(){
		    that.model.clearParam();
		    that.model.properties.func = that.funcSelect.value;
		    that.model.createParam(that.element.id, that.model.properties.func);
		    this.set({label: "変更"});

		    //ラベルを変更
		    that.model.properties._title = that.model.properties.element + ":" + that.model.properties.func;
		    var title = that.model.properties._title;
		    that.widget.set({title: title, style:{width: title.length*a.FONTSIZE+a.REMOVEICONSIZE+"px"}});
		    that.container.reDrawChild(that);
		  }});
	      if(that.model.properties.element && that.model.properties.func)
		that.model.reCreateParamDom();
	      
	      that.dialog.containerNode.appendChild(that.elemSelect.domNode);
	      that.dialog.containerNode.appendChild(that.funcSelect.domNode);
	      that.dialog.containerNode.appendChild(that.elemName.domNode);
	      that.dialog.containerNode.appendChild(that.funcName.domNode);
	      that.dialog.containerNode.appendChild(that.elemButton.domNode);
	      that.dialog.containerNode.appendChild(that.funcButton.domNode);
	      
	      that.elemSelect.startup();
	      that.funcSelect.startup();
	      that.elemName.startup();
	      that.funcName.startup();
	      that.elemButton.startup();
	      that.funcButton.startup();
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
    updateDom: function(properties){
      this.widget.set({
	style:{
	    top: properties.top,
	    left: properties.left
	  }
	});
    },
    removeDialog: function(){
      this.dialog.destroyRecursive();
      this.elemSelect.destroyRecursive();
      this.funcSelect.destroyRecursive();
      this.elemName.destroyRecursive();
      this.funcName.destroyRecursive();
      this.elemButton.destroyRecursive();
      this.funcButton.destroyRecursive();

      delete this.dialog;
      delete this.elemSelect;
      delete this.funcSelect;
      delete this.elemName;
      delete this.funcName;
      delete this.elemButton;
      delete this.funcButton;
    },
    removeDom: function(){
      var lines = this.container.lines;
      for(var i = 0; i < lines.length; i++){
	if(lines[i].end == this.domNode){
	  if(i==lines.length-1){
	    this.container.domNode.removeChild(lines[i].domNode);
	    lines.splice(i);
	  }
	  else {
	    for(var j = 0; j < lines.length; j++){
	      if(lines[j].start == this.domNode){
		lines[i].end = lines[j].end;
		this.container.domNode.removeChild(lines[j].domNode);
		lines.splice(j,1);
		this.container.reDraw(lines[i]);
	      }
	    }
	  }
	}
      }
      this.widget.destroyRecursive();
    },
    createMoveTriggerDomNode: function(){
      return this.domNode;
    },
    onDrop: function(){
      this.inherited(arguments);
    },
    addDialogStack: function(elem){
      this.dialogStack.push(elem);
    },
    startup: function(){
      this.inherited(arguments);
      var that = this;
      this.widget.startup();
      this.model.parent.element.addNewNode(this.domNode);
    }
  }
);


