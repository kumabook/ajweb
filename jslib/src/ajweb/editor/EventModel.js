dojo.provide("ajweb.editor.EventModel");
dojo.require("ajweb.editor.EditorCp");
dojo.declare("ajweb.editor.EventModel", ajweb.editor.EditorCp,
	     { 
	       constructor: function(opt)
	       {
//		 this.eventName = opt.eventName;
/*		 this.id = opt.id;
		 this.properties = opt;
	//	 this.propertyList = opt.propertyList;
//		 this.tagName = opt.tagName;
		 this.create();*/
	       },
	       create: function(){
		 this.widget = new dijit.layout.ContentPane(
		   {
		     id : this.id,
		     title: this.title,
		     content: this.id,
		     region: "center",
		     doLayout: false,
		     style:{ 
		       //position: "absolute",
//		       width: this.properties.width,
//		       height: this.properties.height,
//		       top: this.properties.top,
//		       left: this.properties.left,
	//	       backgroundColor: "#E1EBFB",
//		       border: "solid 1px #769DC0"
		     }
			   });

		 this.element = this.widget.domNode;

	       },

/*	       startup: function(){

//		 console.log( this.id +  "  startup");
		 this.widget.startup();
		 this.update();
		 this.dndEnable();
	       },*/

	       getXMLElement: function(xml){

		 var node =  xml.createElement(this.tagName);
		 for(var i = 0; i < this.propertyList.length; i++){
		   node.setAttribute(this.propertyList[i], this.properties[this.propertyList[i]]);
		 }

		 for(i = 0; i < this.children.length; i++){
		   node.appendChild(this.children[i].getXMLElement(xml));
		 }
		 return node;
	       }
	     }
);
