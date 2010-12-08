dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");
dojo.provide("ajweb.editor.element.Action");
dojo.declare("ajweb.editor.element.Action",
	     [
	       ajweb.editor.element.Element,
	       ajweb.editor.element.DndEnable,
	       ajweb.editor.element.Movable
	     ],
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
    },
    createInitLine: function(){
      this.line = this.container.draw(this.model.parent.children[0].element.domNode, this.domNode);
      this.container.lines.push(this.line);
      this.container.domNode.appendChild(this.line.domNode);      
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      this.widget = new dijit.layout.ContentPane(
	{
	  style:{
	    position: "absolute",
	    width: "100px",
	    height: "50px",
	    top: properties.top,
	    left: properties.left,
	    border: "dotted 1px #769DC0"
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
    removeDom: function(){
      var lines = this.container.lines;
      for(var i = 0; i < lines.length; i++){
	if(lines[i].end == this.domNode){
	    this.container.domNode.removeChild(lines[i].domNode);
	    lines.splice(i, 1);
	}
      }
      this.widget.destroyRecursive();
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
    onDrop: function(name){
      var model = this.model.editor.createModel(
	name,
	{
	  top :ajweb.editor.mousePosition.y - ajweb.editor.getY(this.container.domNode),
	  left :ajweb.editor.mousePosition.x - ajweb.editor.getX(this.container.domNode)
	},
	this.model,
	this.container
      );

      for(var i = 0; i < this.container.lines.length; i++){//追加されたノードを線でつなぐ
	if(this.container.lines[i].start == this.domNode 
	   || this.container.lines[i].end == this.domNode){
	  this.container.lines[i].end = model.element.domNode;
	  this.container.reDraw(this.container.lines[i]);
	}
      }

      if(name == "branch"){
	var conditionModel = model.editor.createModel(
	  "condition",
	  {top: "30px", left: "0px"},
	  model,
	  model.element
	);
	var thenModel = model.editor.createModel(
	  "then",
	  {
	    top :(parseInt(model.properties.top) - 50) + "px",
	    left :(parseInt(model.properties.left) + 200) + "px"
	  },
	  model,
	  this.container
	);
	var elseModel = model.editor.createModel(
	  "else",
	  {
	    top :(parseInt(model.properties.top) + 50) + "px",
	    left :(parseInt(model.properties.left) + 200) + "px"
	  },
	  model,
	  this.container
	);
	//ドロップ要素を隠す
	this.widget.domNode.style.display = "none";
      }
      else {
	this.widget.set(
	  { style: {
	      top: model.properties.top,
	      left: parseInt(model.properties.left + 250) + "px" 
	    }
	  });
	//ドロップ要素を更新


      this.line = this.container.draw(model.element.domNode, this.domNode);
      this.container.lines.push(this.line);
      this.container.domNode.appendChild(this.line.domNode);      
      }

    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
//      this.updateDom(this.model.properties);
    }
  }
);