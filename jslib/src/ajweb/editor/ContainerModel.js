dojo.provide("ajweb.editor.ContainerModel");
dojo.require("ajweb.editor.Model");
dojo.declare("ajweb.editor.ContainerModel", ajweb.editor.Model,
	     { 
	       constructor: function(opt){
		 this.acceptComponentType = ["widget"];
		 this.resizable = true;
	       }
	     }
);