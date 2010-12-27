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
    getDatabaseStore: function(){
      var items = [];
      var databases = this.getDatabasesModel();
      for(var i = 0; i < databases.children.length; i++){
	items.push({name: databases.children[i].properties.id, modelId: databases.children[i].id});
      }
      var store = new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    identifier: "modelId",
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
	items.push({name: models[i].properties.id, modelId: models[i].id});
      }
      
      var store = new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    identifier: "modelId",
	    label : "name",
	    items: items
	  }
	}
      );
      return store;
    },
    getValueStore: function(that){
      var items = [];

      var parentModel = that.parent;
      while(parentModel.tagName != "events"){
	if(parentModel.tagName == "paramCondition"){      //databaseのselect系の内部の場合は,targetItemを追加
	  var targetElement = parentModel.parent.parent.element.element;
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

//イベントから受け取るエレメントがある場合は追加

      items = items.concat([
	{id: "primitive", name: "基本型"},
	{id: "int", name: "int"},
	{id: "string", name: "string" }, { id: "password", name: "password" },{ id: "date" ,name: "date" },{id: "datetime", name: "datetime"},
	{id: "separator1"},
	{id: "element", name: "ウィジェット"}
      ]);

      var widget_children = [];
      var i;
      var widgetModels = this.getWidgetModels();
      for(i = 0; i < widgetModels.length; i++){
	var list = ajweb.editor.FUNCLIST;
	for(var j = 0; j < list.length; j++){
	  if(list[j].name == widgetModels[i].tagName){
	    if(list[j].getters.length > 0)
	      items.push({name: widgetModels[i].properties.id, modelId: widgetModels[i].id, id: widgetModels[i].id});
	  }
	}
//	items.push({name: widgetModels[i].properties.id, modelId: widgetModels[i].id, id: widgetModels[i].id});
//	widget_children.push({name: widgetModels[i].properties.id, modelId: widgetModels[i].id, id: widgetModels[i].id + "visible"});
      }

//      items.push({id: "element", name: "繧ｦ繧｣繧ｸ繧ｧ繝�ヨ", children: widget_children});
      items.push({id: "separator2"});
      items.push({id: "database", name: "データベース"});
      
      var databases_children = [];
//      databases_children.push({id: "targetItem", name: "targetItem"});
//      databases_children.push({id: "receivedItem", name: "receivedItem"});
      items.push({id: "targetItem", name: "targetItem"});
      items.push({id: "receivedItem", name: "receivedItem"});

      var databases = this.getDatabasesModel();
      for(i = 0; i < databases.children.length; i++){
	items.push({name: databases.children[i].properties.id, modelId: databases.children[i].id, id: databases.children[i].id});
//	databases_children.push({name: databases.children[i].properties.id, modelId: databases.children[i].id, id: databases.children[i].id});
      }
//      console.log(databases_children);
  //    items.push({id: "database", name: "繝��繧ｿ繝吶�繧ｹ", children: databases_children});
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
    }
  }
);
