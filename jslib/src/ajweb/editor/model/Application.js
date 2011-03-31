dojo.require("ajweb.editor.model.Visible");

dojo.provide("ajweb.editor.model.Application");
dojo.declare("ajweb.editor.model.Application", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Application.prototype */
  {
    constructor: function(){
      this.application = this;
    },
    /**
     * プロジェクトエディタ上のラベル
     */
    getProjLabel: function(){
      return this.properties.name;
    },
    getEventsModel: function(){
      for(var i = 0; i < this.children.length; i++){
	if(this.children[i].tagName == "events")
	  return this.children[i];
      }
      return null;
    },
    getDatabasesModel: function(){
      for(var i = 0; i < this.children.length; i++){
	if(this.children[i].tagName == "databases")
	  return this.children[i];
      }
      return null;
    },
    getDatabaseModels: function(){
      var databases = this.getDatabasesModel();
      return databases.children;
    },
    getDataTypeStore: function(){
      if(this.dataTypeStore)
	return this.dataTypeStore;
      else {
	this.dataTypeStore = ajweb.editor.getStore("name", "label", dojo.clone(ajweb.resources.dataTypes));
	return this.dataTypeStore;
      }
    },
    getDatabaseStore: function(){
      var databases = this.getDatabasesModel();
      return databases.getChildrenStore();
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
    getWidgetStore: function(store){
      if(!store)
	store = ajweb.editor.getEmptyStore("name", "label");
      var models = this.getWidgetModels();

      for(var i = 0; i < models.length; i++){//todo filterを用意する必要あり
	var setters = [];
	var list = ajweb.editor.MODELLIST;
	for(var j = 0; j < list.length; j++){
	  if(list[j].name == models[i].tagName)
	    setters = list[j].setters;
	}
	if(setters.length > 0){
//	  console.log(models[i].properties.id);
	  store.newItem({label: models[i].properties.id, jsId: models[i].id, name: models[i].properties.id});
	}
	  
      }
      return store;
    },
    getValueStore: function(that, returnType){

      var items = [];
//イベントから受け取るエレメントがある場合は追加
      var parentModel = that.parent;
      while(parentModel.tagName != "events"){
	if(parentModel.tagName == "paramCondition"){      //databaseのselect系の内部の場合は,targetItemを追加
	  var targetElement = this.getElementByPropId(parentModel.parent.parent.properties.element);
	  items.push({name:  "targetItem", label: "targetItem(" + targetElement.properties.id + ")",
		     database: targetElement.properties.id});
	}
	else if(parentModel.tagName == "event"){
	  var targetElement = that.application.getElementByPropId(parentModel.properties.target);
	  if(targetElement.tagName == "database"){//databaseイベントの場合はreceivedItemを追加
	    items.push({name:  "receivedItem", label: "receivedItem(" + targetElement.properties.id + ")", 
			database: targetElement.properties.id});
	  }
	}
	parentModel = parentModel.parent;
      }
      items.push({name: "separator0"});
      items.push({name: "primitive", label: "基本型", type: "data"});
      items.push({name: "int", label: "int", type: "data"});
      items.push({name: "string", label: "string", type: "data"});
      items.push({name: "date", label: "date", type: "data"});
      items.push({name: "time", label: "time", type: "data"});
      items.push({name: "datetime", label: "datetime", type: "data"});

//      items = items.concat(ajweb.resources.dataTypes);
      items.push({name: "separator1"});
      items.push({name: "element", label: "ウィジェット"});

      var widget_children = [];
      var i;
      var widgetModels = this.getWidgetModels();
      for(i = 0; i < widgetModels.length; i++){
	var list = ajweb.editor.MODELLIST;
	for(var j = 0; j < list.length; j++){
	  if(list[j].name == widgetModels[i].tagName){
	    if(list[j].getters.length > 0)
	      items.push({ name: widgetModels[i].properties.id, 
			   label: widgetModels[i].properties.id, 
			   jsId: widgetModels[i].id,
			   type: "widget"
			 });
	  }
	}
      }

      items.push({name: "separator2"});
      items.push({name: "database", label: "データベース"});

      var databases_children = [];

      var databases = this.getDatabasesModel();
      for(i = 0; i < databases.children.length; i++){
	items.push({ name: databases.children[i].properties.id,
		     label: databases.children[i].properties.id,
		     jsId: databases.children[i].id, 
		     type: "database"
		   });
      }
      
      var store = new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    identifier: "name",
	    label : "label",
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
    xmlToModel: function(node, doc){
      var childNode, eventsNode, child;
      for(var i = 0; i < node.childNodes.length; i++){
	childNode = node.childNodes[i];
	if(childNode.tagName != undefined){// || childNode instanceof Element){
	  var attrs = ajweb.editor.getNodeAttributes(childNode);
	  if(childNode.tagName == "events"){
	    eventsNode = node.childNodes[i];
	    continue;
	  }
	  else if(childNode.tagName == "databases"){//プロジェクトエクスプローラ、およびcenterTcに表示するもの
	    child = this.editor.createModel(childNode.tagName, attrs, this, this.editor.centerTc);
	    child.xmlToModel(childNode, doc);
	  }
	  else {//interfaces
	    child = this.editor.createModel(childNode.tagName, attrs, this, this.element);
	    child.xmlToModel(childNode, doc);
	  }

	}
      }
      //eventsモデル
      var eventsAttrs = ajweb.editor.getNodeAttributes(eventsNode);
      child = this.editor.createModel(eventsNode.tagName, eventsAttrs, this, this.element);
      child.xmlToModel(eventsNode, doc);
      this.setRefProperty();
      this.projectRestore();
    },
    getPath: function(){
      return this.properties.name;
    },
    remove: function(){
      while(this.children.length != 0){//childrenをremove
	this.children[0].remove();
      }
      this.editor.removeProjectTree(this);
    }
  }
);
