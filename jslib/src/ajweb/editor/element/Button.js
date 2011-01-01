dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");
dojo.require("ajweb.editor.element.Menuable");
dojo.provide("ajweb.editor.element.Button");
dojo.declare("ajweb.editor.element.Button",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Menuable
	     ],
  /** @lends ajweb.editor.element.Button.prototype */
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
      var that = this;
      this.widget = new dijit.form.Button(
	{style:{position: "absolute",
		top: parseInt(properties.top)-3 + "px",left: parseInt(properties.left)-3+ "px"},
	 label: properties.content,
	 disabled: true
	});
      this.widget.domNode.className = "dijit dijitReset dijitInline dijitButton";
      return this.widget.domNode;
    },
    createMenuTriggerDomNode: function(){
      return this.widget.containerNode;
    },
    updateDom: function(){
      var properties = this.model.properties;
      this.widget.set(
	{style:{top: parseInt(properties.top)-3 + "px",left: parseInt(properties.left)-3+ "px"},
	  label: properties.content});
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


