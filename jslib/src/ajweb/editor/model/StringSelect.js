dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.StringSelect");

dojo.provide("ajweb.editor.model.StringSelect");
dojo.declare("ajweb.editor.model.StringSelect", ajweb.editor.model.Visible,
  /** @lends ajweb.model.StringSelect.prototype */
	     {
	     getGenerateTagName: function(){
	       return "string";
	     },
	       toXMLElement: function(){
		 this.tagName = "string";
		 var node = this.inherited(arguments);
		 this.tagName = "stringSelect";
		 return node;
	       }
	     });