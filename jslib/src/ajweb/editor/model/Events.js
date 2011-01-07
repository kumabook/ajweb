dojo.require("ajweb.editor.model.Model");

dojo.provide("ajweb.editor.model.Events");
dojo.declare("ajweb.editor.model.Events", ajweb.editor.model.Model,
  /** @lends ajweb.editor.model.Model.prototype */
  {
    xmlToModel: function(node, doc, isDisplay){
      var childNode;
      for(var i = 0; i < node.childNodes.length; i++){
	childNode = node.childNodes[i];
	if(childNode.tagName != undefined){// instanceof Element){
	  var attrs = ajweb.editor.getNodeAttributes(childNode);
	  var child;
	  if(childNode.tagName == "event"){
	    child = this.editor.createModel(childNode.tagName, attrs, this, this.editor.eventTc, true);
	    child.xmlToModel(childNode, doc, true);
	  }
	}
      }
    }
  }
);
