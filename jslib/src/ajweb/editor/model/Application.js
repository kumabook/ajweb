dojo.require("ajweb.editor.model.Model");

dojo.provide("ajweb.editor.model.Application");
dojo.declare("ajweb.editor.model.Application", ajweb.editor.model.Model,
  /** @lends ajweb.editor.model.Application.prototype */
  {
    constructor: function(){
      if(this.tagName == "application")
	this.app = this.editor.projectStore.newItem(
	  {name: this.properties.name, modelType: "application", modelId: this.id});
      this.editor.projectStore.save();
      this.application = this;
    },
    getDatabasesModel: function(){
      var databases;
      for(var i = 0; i < this.children.length; i++){
	if(this.children[i].tagName == "databases")
	databases = this.children[i];
      }
      return databases;
    },
    getDatabaseModels: function(){
      var databases = this.getDatabasesModel();
      return databases.children;
    },
    getDatabaseStore: function(){
      var items = [];
      var databases = this.getDatabasesModel();
      for(var i = 0; i < databases.children.length; i++){
	items.push({name: databases.children[i].properties.id, jsId: databases.children[i].id, id: databases.children[i].properties.id});
      }
      var store = new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    identifier: "id",
	    label : "name",
	    items: items
	  }
	}
      );
      return store;
    },
    getWidgetModels: function(){
      var interfaces;
      for(var i = 0; i < this.children.length; i++){
	if(this.children[i].tagName == "interfaces")
	interfaces = this.children[i];
      }
      var models = [];
      return this._getWidgetModels(interfaces, models);
    },
    _getWidgetModels: function(model, models){
      if(model instanceof ajweb.editor.model.Widget)
	models.push(model);
      for(var i = 0; i < model.children.length; i++){
	if(model.children[i] instanceof ajweb.editor.model.Widget)
	 models =  this._getWidgetModels(model.children[i], models);
      }
      return models;
    },
    getWidgetStore: function(){
      var models = this.getWidgetModels();
      var items = [];
      for(var i = 0; i < models.length; i++){
	items.push({name: models[i].properties.id, jsId: models[i].id, id: models[i].properties.id});
      }
      
      var store = new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    identifier: "id",
	    label : "name",
	    items: items
	  }
	}
      );
      return store;
    },
    getValueStore: function(that, returnType){
      var items = [];
//イベントから受け取るエレメントがある場合は追加
      var parentModel = that.parent;
      while(parentModel.tagName != "events"){
	if(parentModel.tagName == "paramCondition"){      //databaseのselect系の内部の場合は,targetItemを追加
	  var targetElement = this.getElementByPropId(parentModel.parent.parent.properties.element);
	  items.push({id:  targetElement.properties.id + ":targetItem", name: "targetItem(" + targetElement.properties.id + ")"});
	}
	else if(parentModel.tagName == "event"){
	  var targetElement = that.application.getElementByPropId(parentModel.properties.target);
	  if(targetElement.tagName == "database"){//databaseイベントの場合はreceivedItemを追加
	    items.push({id:  targetElement.properties.id + ":receivedItem", name: "receivedItem(" + targetElement.properties.id + ")"});
	  }
	}
	parentModel = parentModel.parent;	
      }
      items.push({id: "separator0"});
      items.push({id: "primitive", name: "基本型"});
      items = items.concat(ajweb.editor.dataTypes);
//      items = items.concat([
//	{id: "primitive", name: "基本型"},
//	{id: "int", name: "int"},
//	{id: "string", name: "string" }, { id: "password", name: "password" },{ id: "date" ,name: "date" },{id: "datetime", name: "datetime"}
//	{id: "separator1"},
//	{id: "element", name: "ウィジェット"}
//      ]);
      items.push({id: "separator1"});
      items.push({id: "element", name: "ウィジェット"});

      var widget_children = [];
      var i;
      var widgetModels = this.getWidgetModels();
      for(i = 0; i < widgetModels.length; i++){
	var list = ajweb.editor.FUNCLIST;
	for(var j = 0; j < list.length; j++){
	  if(list[j].name == widgetModels[i].tagName){
	    if(list[j].getters.length > 0)
	      items.push({name: widgetModels[i].properties.id, jsId: widgetModels[i].id, id: widgetModels[i].properties.id});
	  }
	}
      }

      items.push({id: "separator2"});
      items.push({id: "database", name: "データベース"});
      
      var databases_children = [];

      var databases = this.getDatabasesModel();
      for(i = 0; i < databases.children.length; i++){
	items.push({name: databases.children[i].properties.id, jsId: databases.children[i].id, id: databases.children[i].properties.id});
      }
      var store = new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    identifier: "id",
	    label : "name",
	    items: items
	  }
	}
      );
      return store;
    },
    getElementStore: function(){
    },
    getElementByPropId: function(id){
      return this._getElementByPropId(id, this);
    },
    _getElementByPropId: function(id, child){
      for(var i = 0; i < child.children.length; i++){
	if(child.children[i].properties.id == id){
	  return child.children[i];
	}
	else {
	  var elem = this._getElementByPropId(id, child.children[i]);
	  if(elem)
	    return elem;
	}
      }
      return null;
    },
    /**
     * あるモデルを更新したときに、呼び出し、そのモデルを参照しているモデルも更新する
     */
    updateRefProperty: function(model){
      this._updateRefProperty(model, this);
    },
    _updateRefProperty: function(model, child){
      for(var i = 0; i < child.children.length; i++){
	if(child.children[i].updateRefProperty)
	  child.children[i].updateRefProperty(model);
	this._updateRefProperty(model, child.children[i]);
      }
    },
    setRefProperty: function(){
      this._setRefProperty(this);
    },
    _setRefProperty: function(child){
      for(var i = 0; i < child.children.length; i++){
	if(child.children[i].setRefProperty)
	  child.children[i].setRefProperty();
	this._setRefProperty(child.children[i]);
      }
    },
    xmlToModel: function(node, doc, isDisplay){
      var childNode, eventsNode, child;
      for(var i = 0; i < node.childNodes.length; i++){
	childNode = node.childNodes[i];
	
	if(childNode instanceof Element){
	  var attrs = ajweb.editor.getNodeAttributes(childNode);
	  if(childNode.tagName == "events"){
	    eventsNode = node.childNodes[i];
	    continue;	    
	  }
	  else if(childNode.tagName == "databases"){//プロジェクトエクスプローラ、およびcenterTcに表示するもの
	    child = this.editor.createModel(childNode.tagName, attrs, this, this.editor.centerTc);
	  }
	  else {//interfaces
	    child = this.editor.createModel(childNode.tagName, attrs, this, this.element, isDisplay);
	  }
	  child.xmlToModel(childNode, doc, isDisplay);
	}
      }
      //eventsモデル
      var eventsAttrs = ajweb.editor.getNodeAttributes(eventsNode);
      child = this.editor.createModel(eventsNode.tagName, eventsAttrs, this, this.element, isDisplay);
      child.xmlToModel(eventsNode, doc, isDisplay);

      this.setRefProperty();
    }
  }
);
