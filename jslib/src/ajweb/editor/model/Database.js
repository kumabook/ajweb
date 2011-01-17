dojo.require("ajweb.editor.model.Eventable");
dojo.require("ajweb.editor.element.Database");

dojo.provide("ajweb.editor.model.Database");
dojo.declare("ajweb.editor.model.Database", ajweb.editor.model.Eventable,
  /** @lends ajweb.editor.model.Databases.prototype */
  {
    constructor: function(opt){
      this.application.getDataTypeStore().newItem({name: this.id, 
						   label: this.properties.id, database: this});
    },
    getSchemeStore: function(store){
      if(!store)
	store = ajweb.editor.getEmptyStore();
      else {
	store.fetch({onItem: function(item){
		       store.deleteItem(item);
		     }});
	store.save();
      }
      for(var i = 0; i < this.children.length; i++){
	if(this.children[i].tagName == "property"){
	  store.newItem({name: this.children[i].properties.name});
	  }
	}
      return store;
    },
    update: function(){
      var that = this;
      var store = this.application.dataTypeStore;
      store.fetchItemByIdentity(
	{identity: that.id,
	 onItem: function(item){
	   if(store.getValue(item, "database") == that){
	     store.setValue(item, "label", that.properties.id);
	   }
	 }});
      this.inherited(arguments);
    },
    remove: function(){
      this.inherited(arguments);
      var that = this;
      var store = this.application.dataTypeStore;
      store.fetchItemByIdentity(
	{identity: that.id,
	 onItem: function(item){
	   store.deleteItem(item);
	 }});
    }
  }
);
