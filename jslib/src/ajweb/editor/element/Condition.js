dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Condition");
dojo.declare("ajweb.editor.element.Condition", 
	     [ajweb.editor.element.Element,
//	      ajweb.editor.element.Movable,
	      ajweb.editor.element.DndEnable],
  /** @lends ajweb.editor.element.Condition.prototype */
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
    {
      this.isDisplay = false;
      this.dialogStack = [];
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      var that = this;
      var a = ajweb.editor;
      this.widget = new dijit.TitlePane(
	{title: this.model.tagName, toggleable: false, open: false,
	  style:{position: "absolute",width: "80px",top: properties.top,left: properties.left,
	    backgroundColor: "#E1EBFB", border: "solid 1px #769DC0"},
	  onDblClick: function(){
	    that.dialog = new dijit.Dialog({title: that.model.tagName,
					   style: {position: "absolute",
						   height: a.CONDITION_DIALOG_HEIGHT,
						   width: a.CONDITION_DIALOG_WIDTH},
					     onHide: function(){
					       for(var i = 0; i < that.dialogStack.length; i++){
						 that.dialogStack[i].removeDialog();
					       }
					       that.removeDialog();
					       that.dialogStack = [];
					     }
					  });
	    that.containerNode = that.dialog.containerNode;

	    that.predictName = new dijit.layout.ContentPane(
	      { content: "条件: ",
		style: {position: "absolute", top: "50px",left: "10px"}});
	    that.predictSelect = new dijit.form.Select(
	      {	name: "modelId", value: that.model.properties.operator ? that.model.properties.operator : "",
		store: ajweb.editor.conditionOperatorStore, sortByLabel: false,
		style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
	      });
	    that.button = new dijit.form.Button(
	      { label: that.model.properties.operator ? "変更" : "決定",
		style: {position : "absolute",top: "45px",left: "280px"},
		onClick: function(){
		  that.button.set({label: "変更"});
		  for(var i = 0; i < that.model.children.length; i++)
		    that.model.children[i].remove();
		  
		  var tagName = that.predictSelect.value;
		  that.model.properties.operator = that.predictSelect.value;
		  var newModel = that.model.editor.createModel(tagName, {}, that.model, that);
		  newModel.properties.name = tagName;
		  if(tagName == "eq" || tagName == "gt" || tagName == "lt"){
		    that.model.editor.createModel("value", {}, newModel, newModel.element);
		    that.model.editor.createModel("value", {}, newModel, newModel.element);
		  }
		}
	      });

	    if(that.model.properties.operator){
	      for(var i = 0; i < that.model.children.length; i++){
		if(that.model.children[i].reCreateDom)
		  that.model.children[i].reCreateDom(that);
	      }
	    }
	      
	    that.dialog.containerNode.appendChild(that.predictName.domNode);
	    that.dialog.containerNode.appendChild(that.predictSelect.domNode);
	    that.dialog.containerNode.appendChild(that.button.domNode);
	    that.predictName.startup();
	    that.predictSelect.startup();
	    that.button.startup();
	    that.dialog.show();

	    that.dialog._relativePosition = {};
	    that.dialog._relativePosition.x  = 200;
	    that.dialog._relativePosition.y  = parseInt(that.dialog.domNode.style.top) - 50;
	    that.dialog.layout();

	    that.dialog.containerNode.style.width = that.dialog.domNode.style.width;
	    that.dialog.containerNode.style.height = that.dialog.domNode.style.height;
	  }
	});

      this.isDisplay = true;
      return this.widget.domNode;
    },
    removeDom: function(){
      this.widget.destroyRecursive();
    },
    removeDialog: function(){
      if(this.dialog){
	this.dialog.destroyRecursive();
	this.predictName.destroyRecursive();
	this.predictSelect.destroyRecursive();
	this.button.destroyRecursive();
	delete this.dialog;
	delete this.predictName;
	delete this.redictSelect;
	delete this.button;
      }
    },
    addDialogStack: function(elem){
      this.dialogStack.push(elem);
    },
    checkAcceptance: function(){
      if(this.model.children.length > 0)
	return false; 
      else 
	return this.inherited(arguments);
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();     
    }
  }
);