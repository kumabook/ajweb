dojo.require("ajweb.editor.model.Model");

dojo.provide("ajweb.editor.model.Application");
dojo.declare("ajweb.editor.model.Application", ajweb.editor.model.Model,
  /** @lends ajweb.editor.model.Application.prototype */
  { 
    constructor: function(){
      this.app = this.editor.projectStore.newItem(
	{name: this.properties.name, modelType: "application", modelId: this.id});
      this.editor.projectTreeModel.newItem(
	{name: "データモデル", modelType: "databases", modelId: this.id+"_databases"}, this.app);
      this.editor.projectTreeModel.newItem(
	{name: "UIモデル", modelType: "interfaces", modelId: this.id+"_interfaces"}, this.app);
      this.editor.projectStore.save();
    }
  }
);
