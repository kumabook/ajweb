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
    getValueStore: function(){
      var items = [
	{id: "int", name: "int"},
	{id: "string", name: "string" }, { id: "password", name: "password" },{ id: "date" ,name: "date" },{id: "datetime", name: "datetime"},
	{id: "separator1"},
	{id: "element", name: "ウィジェット"}
      ];
      var i;
      var widgetModels = this.getWidgetModels();
      for(i = 0; i < widgetModels.length; i++){
	items.push({name: widgetModels[i].properties.id, modelId: widgetModels[i].id, id: widgetModels[i].id});
      }
      
      items.push({id: "separator2"});
      items.push({id: "database", name: "データベース"});

      var databases = this.getDatabasesModel();
      for(i = 0; i < databases.children.length; i++){
	items.push({name: databases.children[i].properties.id, modelId: databases.children[i].id, id: databases.children[i].id});
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
    }
  }
);
