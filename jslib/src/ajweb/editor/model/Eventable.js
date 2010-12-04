dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.model.Event");

dojo.provide("ajweb.editor.model.Eventable");
dojo.declare("ajweb.editor.model.Eventable", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Eventable.prototype */
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
     * @param {Array} opt.acceptModelType 子要素に持てる要素
     * @param {DOM} opt.container 配置されるDOM要素
     * @param {dijit.layout.TabContainer} opt.eventTc イベントリストを保持するタブコンテナ 
     * @param {DOM} opt.parent 親モデル
     * 
     */
    constructor: function(opt)
    {

      /**
       * イベント名のリスト
       * @type Array
       */
      this.eventList = opt.eventList;

      this.updatePropertiesView();
      /**
       * イベントモデルのリスト
       */
      this.events = this.createEventModel();
    },
    remove: function(){
      this.inherited(arguments);      
      this.removeEventModel();
      this.editor.eventTc.currentModel = null;
      this.clearPropertiesView();
      this.editor.propertyDataStore.currentModel = null;
    },
    /**
     * プロパティエディターの値をこの要素のプロパティに更新する
     */
    updatePropertiesView : function(e){

      this.editor.propertyDataStore.currentModel = this;
      this.clearPropertiesView();

      for(var i = 0; i < this.propertyList.length; i++){
	var value = this.properties[this.propertyList[i]];
	if(!value)
	  value = "";
	this.editor.propertyDataStore.newItem({
	  property : this.propertyList[i],
	  value: value
	  });
      }
      if(e){//一番上のDOMのモデルのプロパティを表示。
	e.preventDefault();
	e.stopPropagation();
      }
      this.element.updateDom(this.properties);
    },
    clearPropertiesView: function(){
      var that = this;
      this.editor.propertyDataStore.fetch({
	onComplete: function(items, request){
	  for(var i = 0; i < items.length; i++){
	    that.editor.propertyDataStore.deleteItem(items[i]);
	  }
	}
      });
    },
    /**
     * イベントモデルエディター上にこの要素のイベントリストを作成する
     */
    createEventModel: function(){
      this.clearEventView();
      var events = [];
      for(var i = 0; i < this.eventList.length; i++){
	events[i] = new ajweb.editor.model.Event(
	  {
	    id: this.id +"_"+ this.eventList[i],
	    tagName: "event",
	    target: this.id,
	    type: this.eventList[i],
	    propertyList: ["type", "target"],
	    properties: { title: this.eventList[i], target: this.id, type: this.eventList[i]},
	    acceptModelType: ["action"],
	    container: this.editor.eventTc,
	    parent: this.application.events,
	    elementClass: "event",
	    editor: this.editor
	  });
	events[i].startup();

	this.editor.createModel("condition", {top: "25px", left: "10px"}, events[i], events[i].element);
	this.editor.createModel("action", {top: "100px", left: "100px"}, events[i], events[i].element);

      }
      
      this.editor.eventTc.currentModel = this;
      return events;
    },
    /**
     * イベントモデルエディター上にこの要素のイベントリスト
     */
    updateEventView : function(){
      if(this.editor.eventTc.currentModel == this)
	return;
      var i = 0;
      this.clearEventView();
      for(i = 0; i < this.events.length; i++){
	this.events[i].reCreateDom(this.editor.eventTc);
	this.events[i].startup();
      }
      this.editor.eventTc.currentModel = this;
    },
    /**
     * イベントビューの内容をクリア(モデルは保持)。
     */
    clearEventView :function(){
      var i;
      var children = this.editor.eventTc.getChildren();

      for(i = 0; i < children.length; i++){///eventTc にmodelのリスト格納したほうがよいかも
	if(this.editor.eventTc.resizeConnects)
	  dojo.disconnect(this.editor.eventTc.resizeConnects[i]);
	this.editor.eventTc.removeChild(children[i]);
	children[i].destroyRecursive();
      }
      this.editor.eventTc.resizeConnects = [];
      this.editor.eventTc.currentModel = null;
    },
    /**
     * モデルを削除
     */
    removeEventModel: function(){
      for(var i = 0; i < this.eventList.length; i++){
	this.events[i].remove();
      }
    }
  }
);