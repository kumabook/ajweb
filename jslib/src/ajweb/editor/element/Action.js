dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");
dojo.provide("ajweb.editor.element.Action");
dojo.declare("ajweb.editor.element.Action",
	     [ ajweb.editor.element.Element,
	       ajweb.editor.element.DndEnable,
	       ajweb.editor.element.Movable],
  /** @lends ajweb.editor.element.Action.prototype */
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
      this.createInitLine();
      this.isDisplay = false;
    },
    createInitLine: function(){
      var startDom =  this.model.parent.element.dndDomNode;
      this.line = this.container.draw(startDom, this.domNode);
      this.container.lines.push(this.line);
      this.container.domNode.appendChild(this.line.domNode);
      return this.line;
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      this.widget = new dijit.layout.ContentPane(
	{
	  content: ajweb.resources.dropFunction,//
	  style:{
	    position: "absolute",
	    width: ajweb.editor.DROP_AREA_WIDTH+"px",
	    height: ajweb.editor.DROP_AREA_HEIGHT+"px",
	    top: properties.top,
	    left: properties.left,
	    border: "dotted 1px #769DC0"
	  }
	});
      this.isDisplay = true;
      return this.widget.domNode;
    },
    createContainerNode: function(){
      return this.container.containerNode;
    },
    updateDom: function(){
      this.widget.set({
	style:{
	    top: this.model.properties.top,
	    left: this.model.properties.left
	  }
	});
    },
    removeDom: function(){
      var lines = this.container.lines;
      for(var i = 0; i < lines.length; i++){
	if(lines[i].end == this.domNode){
	  this.container.domNode.removeChild(lines[i].domNode);
	  lines.splice(i, 1);
	}
      }
      this.widget.destroyRecursive();

      this.isDisplay = false;
    },
    createMoveTriggerDomNode: function(){
      return this.domNode;
    },
    checkAcceptance: function(modelType){
      //最後の要素がなにかで分岐、branch
      if(ajweb.contains(this.model.acceptModelType, modelType))
	return true;
      else
	return false;
    },
    addNewNode: function(newNode, isBranch){
      for(var i = 0; i < this.container.lines.length; i++){//追加されたノードを線でつなぐ
	if(//this.container.lines[i].start == this.domNode ||
	    this.container.lines[i].end == this.domNode){
	  this.container.lines[i].end = newNode;
	  this.container.reDrawLine(this.container.lines[i]);
	}
      }
      if(isBranch){//ドロップ要素を隠す
	this.widget.domNode.style.display = "none";
      }
      else {//ドロップ要素を更新
	this.widget.set(
	  { style: {
	      top: parseInt(newNode.style.top) + "px",
	      left: parseInt(newNode.style.left) + 250 + "px"
	    }
	  });

	this.line = this.container.draw(newNode, this.domNode);
	this.container.lines.push(this.line);
	this.container.domNode.appendChild(this.line.domNode);
      }
    },
    onDrop: function(name){
      if(name == "condition")
	name = "branch";
      var newModel = this.model.editor.newModel(
	name,
	{
	  top: ajweb.editor.mousePosition.y - ajweb.editor.getY(this.container.domNode),
	  left: ajweb.editor.mousePosition.x - ajweb.editor.getX(this.container.domNode)
	},
	this.model,
	this.container
      );
      if(name == "branch"){
	var thenModel = newModel.editor.newModel(
	  "then",
	  {
	    top :(parseInt(newModel.properties.top) - 50) + "px",
	    left :(parseInt(newModel.properties.left) + 200) + "px"
	  },
	  newModel,
	  this.container
	);
	var elseModel = newModel.editor.newModel(
	  "else",
	  {
	    top :(parseInt(newModel.properties.top) + 50) + "px",
	    left :(parseInt(newModel.properties.left) + 200) + "px"
	  },
	  newModel,
	  this.container
	);
	var conditionModel = newModel.editor.newModel(
	  "condition",
	  {top: newModel.properties.top, left: newModel.properties.left},
	  newModel,
	  this.container//	  model.element
	);
	this.container.replaceNode(newModel.element.domNode, conditionModel.element.domNode);
      }
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);