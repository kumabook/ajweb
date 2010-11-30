dojo.require("ajweb.editor.model.Model");

dojo.provide("ajweb.editor.model.Application");
dojo.declare("ajweb.editor.model.Application", ajweb.editor.model.Model,
  /** @lends ajweb.editor.model.Application.prototype */
  { 
    constructor: function(){
      this.app = this.editor.projectStore.newItem(
	{name: this.properties.appName, modelType: "application", modelId: this.properties.appName});
      this.editor.projectTreeModel.newItem(
	{name: "データモデル", modelType: "databases", modelId: "データモデル"}, this.app);
      this.editor.projectTreeModel.newItem(
	{name: "UIモデル", modelType: "interfaces", modelId: "UIモデル"}, this.app);
      this.editor.projectStore.save();
    }
  }
);
