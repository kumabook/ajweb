dojo.require("ajweb.editor.element.Element");

dojo.provide("ajweb.editor.element.Databases");
dojo.declare("ajweb.editor.element.Databases", ajweb.editor.element.Element,
  /** @lends ajweb.editor.element.Databases.prototype */
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
      this.widget =   new dijit.layout.ContentPane(
	{
	  id : this.id,
	  title: "データモデル",
	  closable: true,
	  style:{
	    position: "absolute",
	    width: properties.width,
	    height: properties.height,
	    top: properties.top,
	    left: properties.left,
//	    backgroundColor: "#E1EBFB",
	    border: "solid 1px #769DC0"
	  }
	});
      return this.widget.domNode;
    },
    updateDom: function(properties){

    },
    startup: function(){

      dojo.connect(this.widget.domNode, "onmousedown", this.model, this.model.updatePropertiesView);
      dojo.connect(this.widget.domNode, "onmousedown", this.model, this.model.updateEventView);
      this.dndEnable();
//      this.model.updatePropertiesView();
    }
  }
);


