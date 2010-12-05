dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

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
      var actionElement = this.model.parent.element;
      actionElement.nodes.push(this.domNode);
      var line = actionElement.draw(actionElement.nodes[actionElement.nodes.length-2], 
				    actionElement.nodes[actionElement.nodes.length-1]);
      actionElement.lines.push(line);
      actionElement.domNode.appendChild(line.domNode);
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      this.widget = new dijit.layout.ContentPane(
	{
	  id : this.id,
	  content: this.model.tagName,
	  style:{
	    position: "absolute",
	    width: "250px",
	    height: "40px",
	    top: properties.top,
	    left: properties.left,
	    backgroundColor: "#E1EBFB",
	    border: "solid 1px #769DC0"
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
      this.tablename.innerHTML  = properties.tablename;
    },
    removeDom: function(){     
      var nodes = this.model.parent.element.nodes;
      var lines = this.model.parent.element.lines;
      var i;
      for(i = 0; i < nodes.length; i++){
	if(nodes[i] == this.domNode){
	  nodes.splice(i,1);
	}
      }
      for(i = 0; i < lines.length; i++){
	if(lines[i].end == this.domNode){
	  if(i==lines.length-1){
	    this.container.domNode.removeChild(lines[i].domNode);
	    lines.splice(i);
	  }
	  else {
	    lines[i].end = lines[i+1].end;
	    this.container.domNode.removeChild(lines[i+1].domNode);
	    lines.splice(i+1,1);
	    this.model.parent.element.reDraw(lines[i]);
	  }
	}
      }
      this.widget.destroyRecursive();      
    },
    createMoveTriggerDomNode: function(){
      return this.domNode;
    },
    createDndDomNode: function(){
      return this.domNode;
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);


