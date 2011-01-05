dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("ajweb.editor.element.DndEnable");
dojo.provide("ajweb.editor.element.Branch");
dojo.declare("ajweb.editor.element.Branch",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Removable],
  /** @lends ajweb.editor.element.Branch.prototype */
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
      this.model.parent.element.addNewNode(this.domNode, true);
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      this.widget = new dijit.layout.ContentPane(
	{
	  content : ajweb.resources.dropCondition,
	  style:{ position: "absolute", width: "100px", height: "50px",
	    top: properties.top, left: properties.left,
	    border: "dotted 1px #769DC0"
	  }
	});

            //すでに存在する場合は表示しない。
//      if(this.model.children.length > 0){
//	this.model.parent.element.domNode.style.display = "none";
	//this.conditionContainer.domNode.style.display = "none";
//      }

      return this.widget.domNode;

    },
    onDrop: function(name){
      var conditionModel = this.model.editor.createModel(
	  "condition",
	  {
	    top: ajweb.editor.mousePosition.y - ajweb.editor.getY(this.container.domNode),
	    left: ajweb.editor.mousePosition.x - ajweb.editor.getX(this.container.domNode)
	  },
	  this.model,
	  this.container
	);
//      this.domNode.style.display = "none";
      //ドロップ用の要素をconditionで置き換え
//      this.container.replaceNode(this.domNode, conditionModel.element.domNode);
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
      var i;
      this.container.replaceNode(this.domNode, this.model.parent.element.widget.domNode);
      this.widget.destroyRecursive();
      this.model.parent.element.widget.domNode.style.display = "";
    },
    startup: function(){
      this.inherited(arguments);
      var that = this;
      this.widget.startup();
//      this.model.parent.element.addNewNode(this.domNode, true);
    }
  }
);


