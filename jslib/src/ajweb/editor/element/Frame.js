dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Resizable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Frame");
dojo.declare("ajweb.editor.element.Frame",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Resizable,
	      ajweb.editor.element.Menuable
	     ],
  /** @lends ajweb.editor.element.Panel.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {},
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      this.widget = new dijit.layout.ContentPane(
	{
	  content: "frame",
	  style:{
	    position: "absolute",
	    width: parseInt(properties.width) + "px",
	    height:  parseInt(properties.height) + "px",
	    top:  parseInt(properties.top) + "px",
	    left: parseInt(properties.left) + "px",
	    border: "dashed 1px black"
	  }
	});
      return this.widget.domNode;
    },
    removeDom: function(){
      this.widget.destroy();
    },
    updateDom: function(){
      var properties = this.model.properties;
      this.widget.set({ style: {
			    width: parseInt(properties.width) + "px",
			    height:  parseInt(properties.height) + "px",
			    top:  parseInt(properties.top) + "px",
			    left: parseInt(properties.left) + "px"
			    }});
    },
    onDrop: function(name){
      this.model.editor.newModel(
	name,
	{
	  top :  ajweb.editor.mousePosition.y - ajweb.editor.getY(this.model.element.domNode),
	  left :  ajweb.editor.mousePosition.x - ajweb.editor.getX(this.model.element.domNode)
	},
	this.model,
	this.model.editor.centerTc
      );
      
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
//      this.updateDom();
    }
  }
);