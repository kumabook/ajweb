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
     * @param {Array} opt.acceptComponentType 子要素に持てる要素
     * @param {DOM} opt.parent 配置されるDOM要素
     */
    constructor: function(opt)
    {
      /**
       * 表示するプロパティを保持するdojoストア
       */
      this.propertyDataStore = opt.propertyDataStore;
      /**
       * イベント名のリスト
       * @type Array
       */
      this.eventList = opt.eventList;
      /**
       * イベントモデルのリスト
       */
      this.events = this.createEventModel();

      /**
       * イベントリストを保持するcenterTc
       */
      this.eventTc = opt.eventTc;
      this.updatePropertiesView();
    },
    /**
     * プロパティエディターの値をこの要素のプロパティに更新する
     */
    updatePropertiesView : function(){
      var container = this.element.container.domNode;
      var left = ajweb.editor.getX(this.domNode) - ajweb.editor.getX(container) + "px";
      var top = ajweb.editor.getY(this.domNode) - ajweb.editor.getY(container) + "px";
      this.properties.top = top;
      this.properties.left = left;
      ajweb.editor.currentModel = this;
      var that = this;
//      ajweb.editor.modelEditor.propertyDataStore.fetch({
      this.propertyDataStore.fetch({
	onComplete: function(items, request){
	  for(var i = 0; i < items.length; i++){
	  //  ajweb.editor.modelEditor.propertyDataStore.deleteItem(items[i]);
	    that.propertyDataStore.deleteItem(items[i]);
	  }
	}
      });
//      console.log(this.id + "   " + ajweb.toJSON(this.propertyList));
      for(var i = 0; i < this.propertyList.length; i++){
	var value = this.properties[this.propertyList[i]];
	if(!value)
	  value = "";
//	ajweb.editor.modelEditor.propertyDataStore.newItem({
	this.propertyDataStore.newItem({
	  property : this.propertyList[i],
	  value: value
	  });
	  }
	},
    /**
     * イベントモデルエディター上にこの要素のイベントリストを作成する
     */
    createEventModel: function(){
      var events = [];

      for(var i = 0; i < this.eventList.length; i++){
	events[i] = new ajweb.editor.model.Event(
			      {
				id: this.id +"_"+ this.eventList[i],
				tagName: "event",
				target: this.id,
				type: this.eventList[i],
				properties: { title: this.eventList[i] },
				acceptComponentType:["action"],
				container: ajweb.editor.modelEditor.eventTc,
				parent: ajweb.editor.events,
				elementType: "event"
			      });
      }
      return events;
    },
    /**
     * イベントモデルエディター上にこの要素のイベントリスト
     */
    updateEventView : function(){
      var i = 0;
      var children = this.eventTc.getChildren();
      for( i = 0; i < children.length; i++){
//	ajweb.editor.modelEditor.eventTc.removeChild(children[i]);
	this.eventTc.removeChild(children[i]);
	children[i].destroy();
      }
      for(i = 0; i < this.events.length; i++){
	this.events[i].reCreateDom();
      }
    },

    parse: function(xml){

    }
  }
);



