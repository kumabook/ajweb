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
      /**
       * イベントモデルのリスト
       */
      this.events = [];//this.createEventModel();
      this.updatePropertiesView();
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

      for(var j = 0; j < this.events.length; j++){
	this.events[j].properties.target = this.properties.id;
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

      for(var i = 0; i < this.eventList.length; i++){
	/*var event = new ajweb.editor.model.Event(
	  {
	    id: this.id +"_"+ this.eventList[i],
	    tagName: "event",
	    propertyList: ["type", "target"],
	    properties: { title: this.eventList[i], target: this.id, type: this.eventList[i]},
	    acceptModelType: ["action"],
	    container: this.editor.eventTc,
	    parent: this.application.events,
	    elementClass: "event",
	    editor: this.editor
	  });
	event.startup();*/
	var event = this.editor.createModel("event",
		      { title: this.eventList[i], target: this.properties.id, type: this.eventList[i]},
		      this.application.events, this.editor.eventTc);
	this.events.push(event);
	this.editor.createModel("condition", {top: "25px", left: "10px"}, event, event.element);
	this.editor.createModel("action", {top: "100px", left: "100px"}, event, event.element);
      }
      this.editor.eventTc.currentModel = this;
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