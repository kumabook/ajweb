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


      this.clearPropertiesView();
      this.editor.propertyDataStore.currentModel = this;

      for(var i = 0; i < this.propertyList.length; i++){
	var propertyName, propertyType;
	if(typeof this.propertyList[i] == "string"){
	  if(this.propertyList[i].match("_.*")){
//	    console.log("hidden property " + this.propertyList[i]);
	    continue;
	  }

	  propertyName = this.propertyList[i];
	  propertyType = "text";
	}
	else {
	  if(this.propertyList[i].input == "hidden"){
//	    console.log("hidden property " + this.propertyList[i].name);
	    continue;
	  }
	  propertyName = this.propertyList[i].name;
	  propertyType = this.propertyList[i].type;	    
	}

	var value = this.properties[propertyName];
	if(!value)
	  value = "";
	this.editor.propertyDataStore.newItem(
	  {
	    property : propertyName,
	    value: value
	  });
      }
      if(e){//一番上のDOMのモデルのプロパティを表示。
	e.preventDefault();
	e.stopPropagation();
      }

    },
    clearPropertiesView: function(){
      var that = this;
      var grid =this.editor.propertyDataGrid;
      if(grid.edit.info.cell){//edit情報をキャンセル
	grid.edit.save();
      }
      if(grid.widget){//プロパティビューの値が保存されてないなら保存する．
	this.editor.propertyDataStore.currentModel.properties[grid.widget.property] = grid.widget.value;
	grid.widget = null;
      }
	

	
      this.editor.propertyDataStore.fetch({
	onComplete: function(items, request){
	  for(var i = 0; i < items.length; i++){
	    that.editor.propertyDataStore.deleteItem(items[i]);
	  }
	}
      });
      this.editor.propertyDataStore.save();
    },
    /**
     * イベントモデルエディター上にこの要素のイベントリスト
     */
    updateEventView : function(){
      var that = this;
      if(this.editor.eventTc.currentModel == this)
	return;
      var i = 0;
      this.clearEventView();

      //ターゲットラベルを変更
      this.editor.eventTarget.set({label: this.properties.id});
      //addEventButtonを更新
      this.editor.addEventButton.set({ disabled: this.eventList.length == 0 ? true : false,
				       style: { left: (this.properties.id.length * ajweb.editor.FONT_SIZE)
						+ ajweb.editor.ADD_EVENT_BUTTON_LEFT + "px"}});
      //addEventMenuを更新
      for(i = 0; i < this.eventList.length; i++){
	var eventName = this.eventList[i];
	this.editor.addEventMenu.addChild(new dijit.MenuItem(
	 {
	   label: eventName,
	   onClick: function(eventName) {
	     return function(){
	       var event = that.editor.newModel("event",
			{ title: eventName, target: that.properties.id, type: eventName},
			that.application.getEventsModel(), that.editor.eventTc);
//	     that.editor.newModel("condition", {top: "25px", left: "10px"}, event, event.element);
	     that.editor.newModel("action", {top: "50px", left: "150px"}, event, event.element);
	     };
	   }(eventName)
	 }));
      }

      //eventModelを追加
      for(i = 0; i < this.events.length; i++){
	this.events[i].createDomRecursive(this.editor.eventTc);
	this.events[i].startup();
      }
      this.editor.eventTc.currentModel = this;
    },
    /**
     * イベントビューの内容をクリア(モデルは保持)。
     */
    clearEventView :function(){
      var i, children;

      children = this.editor.addEventMenu.getChildren();
      for(i = 0; i < children.length; i++){
	children[i].destroyRecursive();
	//removeChildは?
      }

      children = this.editor.eventTc.getChildren();
      for(i = 0; i < children.length; i++){///eventTc にmodelのリスト格納したほうがよいかも
	this.editor.eventTc.removeChild(children[i]);
	//children[i].destroyRecursive();
	children[i].element.model.removeDomRecursive();
      }
      this.editor.eventTc.resizeConnects = [];
      this.editor.eventTc.currentModel = null;
    },
    /**
     * モデルを削除
     */
    removeEventModel: function(){
      for(var i = 0; i < this.events.length; i++){
	this.events[i].remove();
      }
    }
  }
);