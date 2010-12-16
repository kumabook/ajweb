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
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      var that = this;
      this.widget = new dijit.TitlePane(
	{
	  title: this.model.tagName, toggleable: false, open: false,
	  style:{position: "absolute",width: "80px",top: properties.top,left: properties.left,
	    backgroundColor: "#E1EBFB", border: "solid 1px #769DC0"},
	  onDblClick: function(){
	    var dialog = new dijit.Dialog({title: that.model.tagName,
					   style: {position: "absolute", height: "150px", width: "350px"},
					     onHide: function(){
					       this.destroyRecursive();
					     }
					  });
	    that.containerNode = dialog.containerNode;
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
	      { label: that.model.properties.element ? "変更" : "決定",
		style: {position : "absolute",top: "45px",left: "280px"},
		onClick: function(){
		  button.set({label: "変更"});
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
	    dialog.containerNode.appendChild(button.domNode);
	    predictName.startup();
	    predictSelect.startup();
	    button.startup();
	    dialog.show();
	    dialog.set({style: {left: "200px", top: parseInt(dialog.domNode.style.top) - 50 + "px"}});

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