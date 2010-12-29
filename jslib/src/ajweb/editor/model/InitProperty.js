dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.InitProperty");

dojo.provide("ajweb.editor.model.InitProperty");
dojo.declare("ajweb.editor.model.InitProperty", ajweb.editor.model.Visible,
  /** @lends ajweb.model.InitProperty.prototype */
	     {
	       toXMLElement: function(xml){
		 this.tagName = "property";
		 var node = this.inherited(arguments);
		 this.tagName = "InitProperty";
		 return node;
	       }
	     });