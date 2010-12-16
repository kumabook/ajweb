dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.PredicateOperator");
dojo.declare("ajweb.editor.element.PredicateOperator", 
	     [ajweb.editor.element.Element],
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
      this.widget = new dijit.layout.ContentPane(
	{ style: { position: "absolute", width: "300px", height: "25px",
		   top: "100px", left: "50px" }});
      var operator = new dijit.layout.ContentPane(
	{ content: ajweb.editor.conditionToOperator(that.model.tagName),
	  style: { position: "absolute", height: "30px", fontSize: "15px",
		   top: "5px", left: "95px" }});
      var leftButton = new dijit.form.Button(
	{ label: "condition",
	  style: {position : "absolute",top: "0px",left: "0px"},
	  onClick: function(){
	    var dialog = new dijit.Dialog({
					    title: "left",
					    style: {position: "absolute",
					       height: "150px", width: "350px"
					      },
					    onHide: function(){
					    }
					  });
	    that.dialog = dialog;
	    var predictName = new dijit.layout.ContentPane(
	      { content: "条件種類: ",
		style: {position: "absolute",top: "50px",left: "10px"}});
	    var predictSelect = new dijit.form.Select(
	      {	name: "modelId", value: that.model.properties.element ? that.model.properties.element : "",
		store: ajweb.editor.conditionOperatorStore, sortByLabel: false,
		style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
	      });
	    var button = new dijit.form.Button(
	      { label: "選択",
		style: {position : "absolute", top: "45px",left: "280px"},
		onClick: function(){		  
		  that.containerNode = dialog.containerNode;
		  if(that.model.children.length == 0){
		    var tagName = predictSelect.value;
		    that.model.properties.element = predictSelect.value;
		    var newModel = that.model.editor.createModel(tagName, {}, that.model, that);
		    newModel.properties.name = tagName;
		    if(tagName == "eq" || tagName == "gt" || tagName == "lt"){
		      that.model.editor.createModel("value", {}, newModel, newModel.element);
		      that.model.editor.createModel("value", {}, newModel, newModel.element);
		    }
		  }
		}

	      });
	    dialog.containerNode.appendChild(predictName.domNode);
	    dialog.containerNode.appendChild(predictSelect.domNode);
	    dialog.containerNode.appendChild(button.domNode);;
	    predictName.startup();
	    predictSelect.startup();
	    button.startup();
	    dialog.show();
	    var parentDialog = that.model.parent.element.dialog;
	    dialog.set({style: {left: parseInt(parentDialog.domNode.style.left) + 300 + "px",
			       top: parseInt(parentDialog.domNode.style.top) - 50 + "px"}});

	    that.dialog.containerNode.style.width = that.dialog.domNode.style.width;
	    that.dialog.containerNode.style.height = that.dialog.domNode.style.height;
	  }});
      var rightButton = new dijit.form.Button(
	{ label: "condition",
	  style: {position : "absolute", top: "0px",left: "150px"},
	  onClick: function(){
	    var dialog = new dijit.Dialog({
					    title: "left",
					    style: {position: "absolute",
					       height: "150px", width: "350px"
					      },
					    onHide: function(){
					    }
					  });
	    that.dialog = dialog;
	    var predictName = new dijit.layout.ContentPane(
	      { content: "条件: ",
		style: {position: "absolute",top: "50px",left: "10px"}});
	    var predictSelect = new dijit.form.Select(
	      {	name: "modelId", value: that.model.properties.element ? that.model.properties.element : "",
		store: ajweb.editor.conditionOperatorStore, sortByLabel: false,
		style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
	      });
	    var button = new dijit.form.Button(
	      { label: "選択",
		style: {position : "absolute", top: "45px",left: "280px"},
		onClick: function(){
		  that.containerNode = dialog.containerNode;
		  if(that.model.children.length == 0){
		    var tagName = predictSelect.value;
		    that.model.properties.element = predictSelect.value;
		    var newModel = that.model.editor.createModel(tagName, {}, that.model, that);
		    newModel.properties.name = tagName;
		    if(tagName == "eq" || tagName == "gt" || tagName == "lt"){
		      that.model.editor.createModel("value", {}, newModel, newModel.element);
		      that.model.editor.createModel("value", {}, newModel, newModel.element);
		    }
		  }
		}

	      });
	    dialog.containerNode.appendChild(predictName.domNode);
	    dialog.containerNode.appendChild(predictSelect.domNode);
	    dialog.containerNode.appendChild(button.domNode);;
	    predictName.startup();
	    predictSelect.startup();
	    button.startup();
	    dialog.show();
	    var parentDialog = that.model.parent.element.dialog;
	    dialog.set({style: {left: parseInt(parentDialog.domNode.style.left) + 400 + "px",
			       top: parseInt(parentDialog.domNode.style.top) + 50 + "px"}});

	    that.dialog.containerNode.style.width = that.dialog.domNode.style.width;
	    that.dialog.containerNode.style.height = that.dialog.domNode.style.height;
	  }});

      this.widget.domNode.appendChild(operator.domNode);
      this.widget.domNode.appendChild(leftButton.domNode);
      this.widget.domNode.appendChild(rightButton.domNode);
      return this.widget.domNode;
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