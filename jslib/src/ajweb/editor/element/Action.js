dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");
dojo.provide("ajweb.editor.element.Action");
dojo.declare("ajweb.editor.element.Action", 
	     [ajweb.editor.element.Element, 
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Drawable
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
      this.startDom = document.createElement("div");
      this.startDom.style.backgroundImage = 'url(circle.png)';
      this.startDom.style.fontSize = "50px";
      this.startDom.style.textAlign = "left";
      this.startDom.style.position = "absolute";
      this.startDom.style.top = "75px";
      this.startDom.style.left = "10px";
      this.startDom.style.height = "30px";
      this.startDom.style.width = "30px";
      this.domNode.appendChild(this.startDom);
      this.nodes.push(this.startDom);
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      this.widget = new dijit.layout.ContentPane(
	{
	  id : this.id,
	  style:{
	    position: "absolute",
	    top: "20px",
	    left: "250px",
	    border: "dashed 1px"
	  }
	});
      return this.widget.domNode;
    },
    updateDom: function(properties){
      this.widget.set(
	{style:{
	   width: parseInt(this.model.editor.eventTc.selectedChildWidget.domNode.style.width) - 250 + "px",
	   height: parseInt(this.model.editor.eventTc.selectedChildWidget.domNode.style.height) - 20 + "px"
//	   width: parseInt(this.container.domNode.style.width) - 250 + "px",
//	   height: parseInt(this.container.domNode.style.height) - 20 + "px"
	 }});
    },
    removeDom: function(){
      dojo.disconnect(this.resizeConnect);
      this.widget.destroyRecursive();
    },
    createMoveTriggerDomNode: function(){
      return this.domNode;
    },
    createDndDomNode: function(){
      return this.domNode;
    },
    onDrop: function(name){
      var model = this.model.editor.createModel(
	name,
	{
	  top :  ajweb.editor.mousePosition.y - ajweb.editor.getY(this.model.element.domNode),
	  left :  ajweb.editor.mousePosition.x - ajweb.editor.getX(this.model.element.domNode)
	},
	this.model,
	this.model.element,
	this.model.editor.propertyDataStore,
	this.model.editor.eventTc
      );
/*      this.nodes.push(model.element.domNode);
      var line = this.draw(this.nodes[this.nodes.length-2], this.nodes[this.nodes.length-1]);
      this.lines.push(line);
      this.domNode.appendChild(line.domNode);*/
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
      this.updateDom(this.properties);
      this.model.editor.eventTc.resizeConnects.push(dojo.connect(this.model.editor.bottomTc, "layout", this, this.updateDom));
    }
  }
);


