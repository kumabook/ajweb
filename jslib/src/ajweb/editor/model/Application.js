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
    }
  }
);
