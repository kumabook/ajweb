dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("ajweb.editor.element.Menuable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Textbox");
dojo.declare("ajweb.editor.element.Textbox",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Menuable],
  /** @lends ajweb.editor.element.Textbox.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs
     * @borrows ajweb.editor.element.Element#id this.id
     * @borrows ajweb.editor.element.Element#model this.model
     * @borrows ajweb.editor.element.Element#container this.container
     * @borrows ajweb.editor.element.Element#domNode this.domNode
     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {ajweb.editor.model.Model} opt.model
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
	  content: properties.content,
	  style:{position: "absolute",width: properties.width, height: "20px",
		 top: properties.top, left: properties.left, border: "solid 1px"
	  }
	});
      return this.widget.domNode;
    },
    updateDom: function(){
      this.widget.set(
	{style:{top: this.model.properties.top, left: this.model.properties.left, width: this.model.properties.width},
	  content: this.model.properties.content
	});
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


