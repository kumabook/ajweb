dojo.provide("ajweb.editor.DBModel");
dojo.require("ajweb.editor.Model");
dojo.declare("ajweb.editor.DBModel", ajweb.editor.Model,
	     { 
	       constructor: function(opt)
	       {
	       },
	       create: function(){
		 this.widget = new dijit.layout.ContentPane(
		   {
		     id :this.id,
//		     content: this.properties.content,
		     style: {
		       position : "absolute",
		       width: this.properties.width,
		       height: this.properties.height,
		       top: this.properties.top,
		       left: this.properties.left,
		       overflow: "visible",
		       backgroundColor: "#E1EBFB",
		       border: "solid 1px #769DC0"
		     }
		   });
		 
		 this.element = this.widget.domNode;
		 this.tablename = document.createElement("div");
		 this.tablename.className = "dijitDialogTitleBar";
		 this.tablename.innerHTML  = this.properties.name;
		 this.element.appendChild(this.tablename);

		 this.deleteArea = document.createElement("div");
		 this.deleteArea.className = "dijitDialogCloseIcon";
		 this.element.appendChild(this.deleteArea);

/*		 this.senderArea = document.createElement("div");
		 this.senderArea.style.position = "absolute";
		 this.senderArea.style.width =  "20px";
		 this.senderArea.style.height = "20px";
		 this.senderArea.style.top = "20px";
		 this.senderArea.style.left = this.properties.width;
		 this.senderArea.style.backgroundColor = "#E1EBFB";
		 this.senderArea.style.border = "solid 1px #769DC0";
		   
		   
		 this.element.appendChild(this.senderArea);*/

		 this.eventViewCreate();
		 this.eventViewUpdate();

	       },
	       update: function(){
		 this.inherited(arguments);
		 this.tablename.innerHTML = this.properties.name;
	       },
	       getXMLElement: function(xml){
		 var node = xml.createElement(this.tagName);
		 for(var i = 0; i < this.propertyList.length; i++){
		   node.setAttribute(this.propertyList[i], this.properties[this.propertyList[i]]);
		 }
		 var schemaNode = xml.createElement("schema");
		 node.appendChild(schemaNode);
		 
		 for(i = 0; i < this.children.length; i++){
		   node.appendChild(this.children[i].getXMLElement(xml));
		 }

		 
		 return node;
	       }
	     }
	    );
