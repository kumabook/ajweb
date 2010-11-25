dojo.require("dojo.dnd.Source");
dojo.require("ajweb.editor.model.Model");
dojo.require("ajweb.editor.element.Databases");

dojo.provide("ajweb.editor.model.Visible");
dojo.declare("ajweb.editor.model.Visible", ajweb.editor.model.Model,
  /** @lends ajweb.editor.model.Visiblee.prototype */
  {
    /**
     * Constructor
     * @class 中央のコンテナに配置するモデルのクラス
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {Object} opt.properties プロパティのリスト
     * @param {Array} opt.propertyList プロパティ名のリスト
     * @param {String} opt.tagName XMLのタグ名
     * @param {Array} opt.events この要素のイベントモデルのリスト
     * @param {Array} opt.eventList イベント名のリスト
     * @param {Array} opt.acceptComponentType 子要素に持てる要素
     * @param {DOM} opt.parent 配置されるDOM要素
     */
    constructor: function(opt)
    {
      /**
       *
       */
      this.container = opt.container;
      /**
       * このモデルを表すDOMを管理するクラスの名前
       * @type ajweb.editor.element.ModelElement
       */
      this.elementType = opt.elementType;
      this.element = this.createDom();
      this.domNode = this.element.domNode;
    },
        /**
     * this.elementTypeに応じて、ajweb.editor.elmenet.[]を作成して返すメソッド。
     */
    createDom: function(){
      var Element = this.elementType.substr(0,1).toLocaleUpperCase() + this.elementType.substr(1);
      var container = this.container;
//      if(this.parent instanceof ajweb.editor.model.AbstractModel)
//	container = this.parent.element;
//      else
//	container = this.parent;
      return new ajweb.editor.element[Element](
	{
	  id: this.id,
	  properties: this.properties,
	  container: container,
	  model: this,
	  acceptComponentType: this.acceptComponentType
	}
      );
    },
    /**
    * propertiesの値を、モデルエディター上のDOM要素のプロパティに反映
    */
    updateDom: function(){
      this.element.updateDom(this.properties);
    },
    /**
     * タブを閉じたあとに再びDOM要素表示する。modelができた状態でDOMを生成。
     */
    reCreateDom: function(){
      this.element = this.createDom();
      for(var i = 0; i < this.children.length; i++){
	this.children[i].reCreateDom();
      }
    }
  }
);


