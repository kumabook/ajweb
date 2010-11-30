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
    checkAcceptance: function(modelType){
      if(ajweb.contains(this.model.acceptModelType, modelType))
	return true;
      else
	return false;
    },
   /**
    * ドラッグアンドドロップ可能にする
    */
    dndEnable : function(){
      var that = this;
      var acceptModelType = this.model.acceptModelType;
      this.dnd = new dojo.dnd.Source(
	this.dndDomNode,
	{
	  accept: ["text", "treeNode"],
	  checkAcceptance : function(source, nodes){
	    var modelInfo = ajweb.editor.getModelInfo(nodes[0].childNodes[2].childNodes[2].innerHTML);
	    return that.checkAcceptance(modelInfo.modelType);
	  },
	  onDrop: function(sources, nodes, copy){
	    var name = nodes[0].childNodes[2].childNodes[2].innerHTML;
	    ajweb.editor.createModel(
	      name,
	      {
		top :  ajweb.editor.mousePosition.y - ajweb.editor.getY(that.model.element.domNode),
		left :  ajweb.editor.mousePosition.x - ajweb.editor.getX(that.model.element.domNode)
	      },
	      that.model,
	      that.model.element,
	      that.model.editor.propertyDataStore,
	      that.model.editor.eventTc
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





