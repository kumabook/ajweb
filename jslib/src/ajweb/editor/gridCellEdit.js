dojo.provide("ajweb.editor.gridCellEdit");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.grid.cells.dijit");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.NumberSpinner");
var dgc = dojox.grid.cells;

dojo.declare("ajweb.editor.gridCellEdit", dgc._Widget, {
	       formatNode: function(inNode, inDatum, inRowIndex){
		 if(!this.selectStore)
		   this.selectStore = ajweb.editor.getEmptyStore();
		 if(this.widget)
		   this.widget.destroyRecursive();
		 var property = this.getProperty(inRowIndex);
		 if(property.input == "selectbox"){
		   if(property.type == "data"){
		     var databases = this.store.currentModel.application.getDatabasesModel();
		     var store = this.selectStore;
		     this.selectStore.fetch({onItem: function(item){
					       store.deleteItem(item);
					     }});
		     this.selectStore.save();
		     for(var j = 0; j < databases.children.length; j++){
		       store.newItem({name: databases.children[j].properties.id});
		     }

		     this.widget = new dijit.form.Select({store: this.selectStore, value: inDatum}, inNode);
		     this.widget.startup();

		     this.widget.property = property.name;//selectbox場合，プロパティビューの値が保存されない場合のためにgridにwidgetを登録
		     this.store.currentModel.editor.propertyDataGrid.widget = this.widget;

		     return this.widget;
		   }
		   else if(property.type == "dataproperty"){
		     var model = this.store.currentModel;
		     if(model.properties[property.target]){
		       var databaseModel =  model.application.getElementByPropId(model.properties[property.target]);
		       this.selectStore = databaseModel.getSchemeStore(this.selectStore);
		       this.widget = new dijit.form.Select(
			 {store: this.selectStore,
			  value: inDatum
			 }, inNode);
		       this.widget.startup();
		       this.widget.property = property.name;//selectbox場合，プロパティビューの値が保存されない場合のためにgridにwidgetを登録
		       this.store.currentModel.editor.propertyDataGrid.widget = this.widget;
		       return this.widget;
		     }
		   }
		   else {
		     this.widget = new dijit.form.Select({store: this.selectStore, value: inDatum}, inNode);
		     this.widget.startup();

		     this.widget.property = property.name;//selectbox場合，プロパティビューの値が保存されない場合のためにgridにwidgetを登録
		     this.store.currentModel.editor.propertyDataGrid.widget = this.widget;

		     return this.widget;
		   }
		 }
		 else if(property.input == "number"){
		   this.widget = new dijit.form.NumberSpinner({value: parseInt(inDatum), constraints: {min: 0, max: 9999}}, inNode);
		   return this.widget;
		 }
/*		 else if(property.input == "date"){
		   return this.widget;
		 }*/
		 else if(property.name == "tagName" || property.input == "unEdit"){
		   var prop = this.getWidgetProps(inDatum);
		   prop.content = inDatum;
		   this.widget = new dijit.layout.ContentPane(prop, inNode);
		   return this.widget;
		 }
		 else {// if(property.input == "textbox"
		   this.widget = new dijit.form.TextBox(this.getWidgetProps(inDatum), inNode);
		   this.widget.focus();
		   return this.widget;
		  }

		 this.widget = new dijit.form.TextBox(this.getWidgetProps(inDatum), inNode);
		 this.widget.focus();
		 return this.widget;
		},
	       getProperty: function(inRowIndex){
		 var property = this.store.currentModel.propertyList[inRowIndex];
		 var propertyName, propertyType;
		 if(!property){
		   console.log("property is NULL!");
		   return null;
		 }
		 if(typeof property == "string"){
		   return {name: property, input: "textbox", type: "string"};
		 }
		 else {
		   return property;
		 }
	       }

	     });