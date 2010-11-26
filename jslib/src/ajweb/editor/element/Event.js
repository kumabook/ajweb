dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");

dojo.provide("ajweb.editor.element.Event");
dojo.declare("ajweb.editor.element.Event", [
	       ajweb.editor.element.Element,
	       ajweb.editor.element.DndEnable],
  /** @lends ajweb.editor.element.Event.prototype */
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
    {
    },
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
       this.widget =   new dijit.layout.ContentPane(
	{
	  id : this.id,
	  content: this.id,
	  title: properties.title,
	  closable: false,
	  style:{
	    position: "absolute",
	    top: "0px",
	    left: "0px"
	  }
	});
      return this.widget.domNode;
    },
    updateDom: function(properties){

    },
    startup: function(){
      this.inherited(arguments);
    }
  }
);


