dojo.require("ajweb.editor.model.Eventable");

dojo.provide("ajweb.editor.model.Widget");
dojo.declare("ajweb.editor.model.Widget", ajweb.editor.model.Eventable,
  /** @lends ajweb.model.Widget.prototype */
{
/* todo valueStore wdigetStoreをapplicationにひとつだけ持たせるようにする　dataTypeStoreを参考に
  constructor: function(){
    this.application.getDataTypeStore().newItem({name: this.id, 
						 label: this.properties.id, database: this});	
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
    var that = this;
    var store = this.application.dataTypeStore;
    store.fetchItemByIdentity(
      {identity: that.id,
       onItem: function(item){
	 store.deleteItem(item);
       }});
    this.inherited(arguments);
  }*/
});