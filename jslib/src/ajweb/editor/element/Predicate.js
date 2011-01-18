dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.layout.ContentPane");

dojo.provide("ajweb.editor.element.Predicate");
dojo.declare("ajweb.editor.element.Predicate",
	     [ajweb.editor.element.Element],
  /** @lends ajweb.editor.element.Predicate.prototype */
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
     * @param {boolean} opt.resizable サイズが変更可能か
     * @param {boolean} opt.movable 位置が変更可能か
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt){},
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      var that = this;
      var a = ajweb.editor;
      this.widget = new dijit.layout.ContentPane(
	{ style: { position: "absolute", width: "300px", height: "130px",
		   top: a.PARAM_CONTAINER_TOP+30+"px", left: a.PARAM_CONTAINER_LEFT+"px"}});
      var operator = new dijit.layout.ContentPane(
	{ content: ajweb.editor.conditionToOperator(that.model.tagName),
	  style: { position: "absolute", height: "40px", fontSize: "20px",
		   top: a.CONDITION_OPERATOR_TOP+"px", left: a.CONDITION_OPERATOR_LEFT+"px" }});
      this.widget.domNode.appendChild(operator.domNode);

      return this.widget.domNode;
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