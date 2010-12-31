dojo.require("ajweb.editor.model.Visible");

dojo.provide("ajweb.editor.model.Condition");
dojo.declare("ajweb.editor.model.Condition", ajweb.editor.model.Visible,
  /** @lends ajweb.model.Condition.prototype */
    {
      remove: function(){
	this.inherited(arguments);
	if(this.parent.tagName == "branch"){
	  this.parent.remove();
	}
      }
    });