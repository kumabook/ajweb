dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.ParamCondition");

dojo.provide("ajweb.editor.model.ParamCondition");
dojo.declare("ajweb.editor.model.ParamCondition", ajweb.editor.model.Visible,
  /** @lends ajweb.model.ParamCondition.prototype */
	     {
	       toXMLElement: function(isSave){
		 if(isSave) return this.inherited(arguments);
		 this.tagName = "condition";
		 var node = this.inherited(arguments);
		 this.tagName = "paramCondition";
		 return node;
	       }
	     });