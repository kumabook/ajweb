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
      this.container = opt.container;
    },


    /**
    * propertiesの値を、モデルエディター上のDOM要素のプロパティに反映
    */
    updateDom: function(){
      if(this.element){
	this.element.updateDom();
      }
    },
    /**
     * this.elementClassに応じて、ajweb.editor.elmenet.[]を作成してthis.elementに設定するメソッド。
     */
    createDom: function(container){
      if(!container)
	container = this.container;
      else　
	this.container = container;
      var Element = this.elementClass.substr(0,1).toLocaleUpperCase() + this.elementClass.substr(1);
      this.element = new ajweb.editor.element[Element](
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
     * modelができた状態でDOMを生成。タブを閉じたあとなど再び開いたときなど。
     */
    createDomRecursive: function(container){
      this.createDom(container);
      this.createDomDescendants();
    },
    /**
     * 
     */
    createDomDescendants: function(container){
      if(!container)
	container = this.element;
      if(!(container.openDialog) && this.tagName != "frame")
	for(var i = 0; i < this.children.length; i++){
	  if(this.children[i].createDomRecursive)
	    this.children[i].createDomRecursive(container);
	}
    },
    refreshDom: function(){
      var container = this.element.container;
      this.removeDom();
      this.createDomRecursive(container);
      this.startup();
    },
    removeDom: function(){
      if(this.element)
	  this.element.removeDom();
      delete this.element;
    },
    removeDomRecursive: function(){
      this.removeDomDescendants();
      this.removeDom();
    },
    removeDomDescendants: function(){
      for(var i = 0; i < this.children.length; i++){
	if(this.children[i].removeDomRecursive)
	  if(this.tagName != "frame")
	    this.children[i].removeDomRecursive(this.element);
      }
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
      if(this.element){
	this.element.startup();
	if(!(this.element.openDialog) && this.tagName != "frame"){
	  for(var i = 0; i < this.children.length; i++){
	    this.children[i].startup();
	  }
	}
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