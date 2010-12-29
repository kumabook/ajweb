dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Property");

dojo.provide("ajweb.editor.model.Init");
dojo.declare("ajweb.editor.model.Init", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Init.prototype */
  {
    createItem: function(){
      var itemModel =  this.editor.createModel("item", {}, this, this.element);
      for(var i = 0; i < this.parent.children.length; i++){
	var propertyModel = this.parent.children[i];
	if(propertyModel.tagName == "property"){
	  this.editor.createModel("initProperty", 
				  {
				    name: propertyModel.properties.name,
				    type: propertyModel.properties.type
				  },
				  itemModel, itemModel.element, true);
	}
      }
    }    
  });
