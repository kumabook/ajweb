dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("ajweb.editor.element.Menuable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Condition");
dojo.declare("ajweb.editor.element.Condition",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Removable,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.HasDialog,
	      ajweb.editor.element.Menuable
	     ],
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
    dialogWidth: ajweb.editor.CONDITION_DIALOG_WIDTH+"px",
    dialogHeight: ajweb.editor.CONDITION_DIALOG_HEIGHT+"px",
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      var that = this;
      var a = ajweb.editor;
      this.widget = new dijit.TitlePane(
	{title: ajweb.resources.condition, toggleable: false, open: false,
	  style:{position: "absolute",
		 width: ajweb.resources.condition.length*ajweb.editor.FONT_SIZE
		 +ajweb.editor.REMOVE_ICON_SIZE/2+"px",
		 top: properties.top,left: properties.left,
		 backgroundColor: "#E1EBFB", border: "solid 1px #769DC0"}
	});

      this.isDisplay = true;
      return this.widget.domNode;
    },
    createDialogContents: function(){
      var that = this;
      that.containerNode = that.dialog.containerNode;
      that.predictName = new dijit.layout.ContentPane(
	{ content: ajweb.resources.conditionSelect,
	  style: {position: "absolute", top: "45px",left: "10px"}
      });
      that.predictSelect = new dijit.form.Select(
	{ value: that.model.properties.operator ? that.model.properties.operator : "",
	  store: ajweb.editor.conditionOperatorStore, sortByLabel: false,
	  style: {position : "absolute", width: "150px",top: "40px", left: "70px"}
	});
      that.button = new dijit.form.Button(
	{ label: that.model.properties.operator ? ajweb.resources.change : ajweb.resources.enter,
	style: {position : "absolute",top: "40px",left: "250px"},
	onClick: function(){
	  that.button.set({label: ajweb.resources.change});
	  for(var i = 0; i < that.model.children.length; i++)
	    that.model.children[i].remove();

	  var tagName = that.predictSelect.value;
	  that.model.properties.operator = that.predictSelect.value;
	  if(tagName != "true"){
	    var newModel = that.model.editor.createModel(tagName, {}, that.model, that);
	    newModel.properties.name = tagName;
//	    var left = (parseInt(that.dialog.style.width) / 2) + "px";
	    var left = "70px";
	    if(tagName == "eq" || tagName == "gt" || tagName == "lt"){
	      that.model.editor.createModel("value", {top: "0px", left: left}, newModel, newModel.element);
	      that.model.editor.createModel("value", {top: "70px", left: left}, newModel, newModel.element);
	    }
	  }
	}
      });

      if(that.model.properties.operator){
	for(var i = 0; i < that.model.children.length; i++){
	  if(that.model.children[i].reCreateDom)
	    that.model.children[i].reCreateDom(that);
	    that.model.children[i].startup();
	    }
      }

      that.dialog.containerNode.appendChild(that.predictName.domNode);
      that.dialog.containerNode.appendChild(that.predictSelect.domNode);
      that.dialog.containerNode.appendChild(that.button.domNode);
      that.predictName.startup();
      that.predictSelect.startup();
      that.button.startup();

    },
    removeDom: function(){
      this.widget.destroyRecursive();
      var i;
      //eventの子要素の場合
      var initLine = this.container.lines[0];
      if(initLine.start == this.domNode){
	initLine.start = this.container.conditionContainer.domNode;//線のつなぎかえ
	this.container.reDrawLine(initLine);
	this.container.conditionContainer.domNode.style.display = "";//ドロップ要素を表示
      }
      //brachの子要素の場合
      else if(this.model.parent.tagName == "branch"){
	this.container.replaceNode(this.domNode, this.model.parent.element.domNode);//線のつなぎかえ
	this.model.parent.element.domNode.style.display = "";//ドロップ要素を表示(branch)
      }
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
      var parent = this.model.parent;
      if(parent.tagName == "branch" && parent.children.length > 0){
	this.container.replaceNode(this.model.parent.element.domNode, this.domNode);
	parent.element.domNode.style.display = "none";
      }
      else if(parent.tagName == "event" && parent.getCondition()){
	this.container.replaceNode(parent.element.dndDomNode, this.domNode);
	parent.element.dndDomNode.style.display = "none";
      }
    }
  }
);