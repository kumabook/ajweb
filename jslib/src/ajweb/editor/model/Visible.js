dojo.require("dojo.dnd.Source");
dojo.require("ajweb.editor.model.Model");
dojo.require("ajweb.editor.element.Databases");

dojo.provide("ajweb.editor.model.Visible");
dojo.declare("ajweb.editor.model.Visible", ajweb.editor.model.Model,
  /** @lends ajweb.editor.model.Visible.prototype */
  {
    /**
     * Constructor
     * @class 中央のコンテナに配置するモデルのクラス
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.elementClass DOM要素用のクラス名
     * @param {Object} opt.properties プロパティのリスト
     * @param {Array} opt.propertyList プロパティ名のリスト
     * @param {String} opt.tagName XMLのタグ名
     * @param {Array} opt.events この要素のイベントモデルのリスト
     * @param {Array} opt.eventList イベント名のリスト
     * @param {Array} opt.acceptModelType 子要素に持てる要素
     * @param {ajweb.editor.model.Model} opt.parent 親モデル
     * @param {ajweb.editor.element.Element} opt.container 配置されるDOM要素
     */
    constructor: function(opt, display)
    {
      /**
       * このモデルを表すDOMを管理するクラスの名前
       * @type ajweb.editor.element.ModelElement
       */
      this.elementClass = opt.elementClass;
      this.element = this.createDom(opt.container, display);

    },
    /**
     * this.elementClassに応じて、ajweb.editor.elmenet.[]を作成して返すメソッド。
     */
    createDom: function(container, display){
      if(display) 
	return null;

      this.isDisplay = true;
      var Element = this.elementClass.substr(0,1).toLocaleUpperCase() + this.elementClass.substr(1);
      return new ajweb.editor.element[Element](
	{
	  id: this.id,
	  properties: this.properties,
	  container: container,
	  model: this,
	  acceptModelType: this.acceptModelType
	}
      );
    },
    /**
    * propertiesの値を、モデルエディター上のDOM要素のプロパティに反映
    */
    updateDom: function(){
      this.element.updateDom(this.properties);
//      for(var i = 0; i < this.children.length; i++){
	//this.children[i].updateDom();
//      }
    },
    /**
     * タブを閉じたあとに再びDOM要素表示する。modelができた状態でDOMを生成。
     */
    reCreateDom: function(container){
      this.element = this.createDom(container);
      for(var i = 0; i < this.children.length; i++){
	this.children[i].reCreateDom(this.element);
      }
    },
    removeDom: function(){
      if(this.isDisplay)
	this.element.removeDom();
      delete this.element;
      this.isDisplay = false;	
    },
    removeDomRecursive: function(){
      for(var i = 0; i < this.children.length; i++){
	this.children[i].removeDomRecursive(this.element);
      }
      this.removeDom();
    },
   /**
     * モデルを削除する。
     */
    remove: function(){
      this.inherited(arguments);

      this.removeDom();
      this.editor.removeProjectTree(this);
    },
    startup: function(){
      if(this.element)
	this.element.startup();
      for(var i = 0; i < this.children.length; i++){
	this.children[i].startup();
      }
    },
    /**
     * ダミー
     */
    updatePropertiesView : function(){
    },
    updateEventView : function(){}
  }
);