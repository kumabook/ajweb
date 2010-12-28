dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.TitlePane");
dojo.provide("ajweb.editor.element.Branch");
dojo.declare("ajweb.editor.element.Branch",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Movable,
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
    {},
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      this.widget = new dijit.layout.ContentPane(
	{
	  content: this.model.tagName,
	  style:{ position: "absolute", width: "100px", height: "50px",
	    top: properties.top, left: properties.left, backgroundColor: "#E1EBFB", border: "solid 1px #769DC0"
	  }
	});

      this.model.parent.element.domNode.style.display = "none";

      return this.widget.domNode;
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
/*      for(i = 0; i < lines.length; i++){
	if(lines[i].start == this.domNode){
	  console.log(this.domNode);
	    this.container.domNode.removeChild(lines[i].domNode);
	    lines.splice(i, 1);
	}
      }*/
      for(i = 0; i < lines.length; i++){
	if(lines[i].end == this.domNode){
	    lines[i].end = this.model.parent.element.widget.domNode;
	    this.container.reDraw(lines[i]);
	}
      }
      this.widget.destroyRecursive();
      this.model.parent.element.widget.domNode.style.display = "inline";
    },
    startup: function(){
      this.inherited(arguments);
      var that = this;
      this.widget.startup();
      this.model.parent.element.addNewNode(this.domNode, true);      
    }
  }
);


