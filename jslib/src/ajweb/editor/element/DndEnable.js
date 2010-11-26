dojo.provide("ajweb.editor.element.DndEnable");
dojo.declare("ajweb.editor.element.DndEnable", null,
  /** @lends ajweb.editor.element.DndEnable.prototype */
  {
    /**
     * Constructor
     * @class DOMノードをドラック＆ドロップで子要素を配置できるようにするインターフェース。
     * 必ずajweb.editor.element.Elementの後にmixinする。
     * @constructs
     */
    constructor: function(opt)
    {
      /**
       * 子要素をドロップする用のDOMノード
       * @type HTMLElement
       */
      this.dndDomNode = this.createDndDomNode();
     },
    /**
     * ドロップ領域用のdomを返す。サブクラスでオーバーライド
     */
    createDndDomNode :function (){
      return this.domNode;
    },
    /**
    * ドロップ可能かチェックする
    * @param {String} ウィジェットタイプ
    */
    checkAcceptance: function(widgetType){
      if(ajweb.contains(this.acceptComponentType, widgetType))
	return true;
      else
	return false;
    },
   /**
    * ドラッグアンドドロップ可能にする
    */
    dndEnable : function(){
      var that = this;
      var acceptComponentType = this.acceptComponentType;
      this.dnd = new dojo.dnd.Source(
	this.dndDomNode,
	{
	  accept: ["text", "treeNode"],
	  checkAcceptance : function(source, nodes){
	    var component = ajweb.editor.getComponent(nodes[0].childNodes[2].childNodes[2].innerHTML);
	    return that.checkAcceptance(component.elementType);
	  },
	  onDrop: function(sources, nodes, copy){
	    ajweb.editor.createModel(
	      nodes[0].childNodes[2].childNodes[2].innerHTML,
	      that.model,
	      that.model.element,
	      that.model.propertyDataStore,
	      that.model.eventTc
	    );
	  }
	}
      );
    },
    /**
    * ドラッグアンドドロップ不可能にする
    */
    dndDisable: function(){
      this.dnd.destory();
    },
    startup: function(){
      this.dndEnable();
      this.inherited(arguments);
    }
  }
);





