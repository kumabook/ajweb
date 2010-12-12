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

      this.DatabaseStore = new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    identifier: "modelId",
	    label : "name",
	    items: []
	  }
	}
      );
      this.WidgetStore = new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    identifier: "modelId",
	    label : "name",
	    items: []
	  }
	}
      );
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
    getWidgetStore: function(){
    }
  }
);
