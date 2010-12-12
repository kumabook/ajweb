dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Param");
dojo.declare("ajweb.editor.element.Param",
	     [ajweb.editor.element.Element],
  /** @lends ajweb.editor.element.Property.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {boolean} opt.resizable サイズが変更可能か
     * @param {boolean} opt.movable 位置が変更可能か
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {},
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var that = this;
      var keyName = new dijit.layout.ContentPane(
	{
	  content: properties.name + ":",
	  style: { position: "absolute", top: "0px", left: "10px"}
	});

      this.widget = new dijit.layout.ContentPane(
	{ 
	  style: {
	   position: "absolute",
	   top: (this.container.containerNode.childNodes.length * 30) + "px", left: "10px",
	   width: "350px", height: "30px"
	 }});
      this.widget.domNode.appendChild(keyName.domNode);
      return this.widget.domNode;
    },
    createContainerNode: function(){
      var value = new dijit.layout.ContentPane(
	{style: {
	   position: "absolute",
	   top: "0px", left: "200px",
	   width: "120px", height: "20px",
	   border: "dotted 1px"
	 }});
      this.domNode.appendChild(value.domNode);
      return value.domNode;
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