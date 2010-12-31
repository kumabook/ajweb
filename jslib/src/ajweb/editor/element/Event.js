dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Drawable");
//dojo.require("dojox.gfx");

dojo.provide("ajweb.editor.element.Event");
dojo.declare("ajweb.editor.element.Event", [
	       ajweb.editor.element.Element,
	       ajweb.editor.element.DndEnable,
	       ajweb.editor.element.Movable,
	       ajweb.editor.element.Drawable
	     ],
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
      this.isDisplay = false;
    },
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var target = this.model.application.getElementByPropId(this.model.properties.target);
      this.widget =   new dijit.layout.ContentPane(
	{
	  content: target.properties.id + " " + this.model.properties.type,
	  title: properties.type,
	  closable: true,
	  doLayout: false,
	  style:{
	    position: "absolute",
	    top: "0px",
	    left: "0px"
	  },
	  onClose: function(){ that.model.remove();}
	});
      this.isDisplay = true;
      this.widget.element = this;
      this.conditionContainer = new dijit.layout.ContentPane(
	{
	  content : "<br/>&nbsp;drop condition",
	  style:{
	    position: "absolute",
	    width: "100px",
	    height: "50px",
	    top: "25px",
	    left: "10px",
	    border: "dotted 1px #769DC0"
	  }
	});
      //すでに存在する場合は表示しない。
      if(this.model.getCondition()){
	this.conditionContainer.domNode.style.display = "none";
      }

      this.widget.domNode.appendChild(this.conditionContainer.domNode);
      return this.widget.domNode;
    },
    createMoveDomNode: function(){
      return this.conditionContainer.domNode;
    },
    createMoveContainerDomNode: function(){
      return this.domNode;
    },
    createMoveTriggerDomNode: function(){
      return this.conditionContainer.domNode;
    },

    createDndDomNode: function(){
      return this.conditionContainer.domNode;
    },
    onDrop: function(name){
      var newModel = this.inherited(arguments);
      //ドロップ用要素を隠す
      this.conditionContainer.domNode.style.display = "none";
      //新しい要素で線をつなぎかえる
      this.lines[0].start = newModel.element.domNode;
      this.reDraw(this.lines[0]);
    },
    updateDom: function(){
      var target = this.model.application.getElementByPropId(this.model.properties.target);
      this.widget.set({content: target.properties.id + " " + this.model.properties.type});
    },
    removeDom: function(){
      this.container.removeChild(this.widget);
      this.widget.destroyRecursive();

      this.isDisplay = false;
    },
    startup: function(){
      this.inherited(arguments);
    }
  }
);