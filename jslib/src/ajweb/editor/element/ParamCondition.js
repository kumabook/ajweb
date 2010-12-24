dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.ParamCondition");
dojo.declare("ajweb.editor.element.ParamCondition", 
	     [ajweb.editor.element.Element,
//	      ajweb.editor.element.Movable,
	      ajweb.editor.element.DndEnable],
  /** @lends ajweb.editor.element.ParamCondition.prototype */
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
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      var that = this;
      that.dialogStack = [];
      this.widget = new dijit.form.Button(
	{label: "condition", 
	  style:{position: "absolute", top: "0px" ,left: "0px"},
	  onClick: function(){
	    var dialog = new dijit.Dialog({title: that.model.tagName,
					   style: {position: "absolute", height: "150px", width: "350px"}
					  });
	    that.containerNode = dialog.containerNode;
	    that.dialog = dialog;
	    var predictName = new dijit.layout.ContentPane(
	      { content: "条件: ",
		style: {position: "absolute",top: "50px",left: "10px"}});
	    var predictSelect = new dijit.form.Select(
	      {	name: "modelId", value: that.model.properties.operator ? that.model.properties.operator : "",
		store: ajweb.editor.conditionOperatorStore, sortByLabel: false,
		style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
	      });
	    var button = new dijit.form.Button(
	      { label: that.model.properties.operator ? "変更" : "決定",
		style: {position : "absolute",top: "45px",left: "280px"},
		onClick: function(){
		  button.set({label: "変更"});
		  for(var i = 0; i < that.model.children.length; i++)
		    that.model.children[i].remove();
		  
		  var tagName = predictSelect.value;		  
		  that.model.properties.operator = predictSelect.value;
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
		that.model.children[i].reCreateDom(that);
	      }
	    }

	    dialog.containerNode.appendChild(predictName.domNode);
	    dialog.containerNode.appendChild(predictSelect.domNode);
	    dialog.containerNode.appendChild(button.domNode);
	    predictName.startup();
	    predictSelect.startup();
	    button.startup();
	    dialog.show();

	    that.parentDialog = that.model.parent.parent.element.dialog;
	    that.dialog._relativePosition = {};
	    that.dialog._relativePosition.x  = parseInt(that.parentDialog.domNode.style.left) + 300;
	    that.dialog._relativePosition.y  = parseInt(that.parentDialog.domNode.style.top);
	    that.dialog.layout();

	    dialog.containerNode.style.width = dialog.domNode.style.width;
	    dialog.containerNode.style.height = dialog.domNode.style.height;
	  }
	});

      this.isDisplay = true;
      return this.widget.domNode;
    },
    removeDom: function(){
      this.widget.destroyRecursive();
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