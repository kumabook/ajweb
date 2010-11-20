dojo.require("dijit.form.FilteringSelect");
dojo.declare("ajweb.editor.DBPropertyModel", ajweb.editor.Model,
	     { 
	       constructor: function(opt)
	       {
	       },
	       create: function(){
		 var propName = new dijit.form.TextBox(
		   {
		     name: this.id + "propName",
		     value: this.properties.content /* no or empty value! */,
		     
		     style: {
		       position : "absolute",
		       width: "100px",
//		       height: this.properties.height,
		       top: "0px",
		       left: this.properties.left
		       //		       borderBottom: "solid 1px black"
		     }
		   });

		 var stateStore = new dojo.data.ItemFileReadStore(
		   {
		     data:{
		       identifier: "name",
		       label: "name",
		       items: [
			 { name: "int" }, { name: "string" },{ name: "date" },{name: "datetime"}
		       ]
		     }});
		 
		 var filteringSelect = new dijit.form.FilteringSelect(
		   {
		     id: this.id + "select",
		     name: "state",
		     value: "int",
		     store: stateStore,
		     searchAttr: "name",
		     style: {
		       position : "absolute",
		       width: "50px",
		   //    height: this.properties.height,
		       top: "0px",
		       right: "0px"
		     }
		       //		       borderBottom: "solid 1px black"
		   });
		 this.widget = new dijit.layout.ContentPane(
		   {
		     id :this.id,
//		     content: this.properties.content,
		     content: "",
		     style: {
		       position : "absolute",
		       width: this.parentDom.style.width,
		       height: this.properties.height,
		       top: this.properties.top,
		       left: this.properties.left
//		       borderBottom: "solid 1px black"
		     }
		   });

		 this.element = this.widget.domNode;

		 this.element.appendChild(propName.domNode);
		 this.element.appendChild(filteringSelect.domNode);

	       },
	       getXMLElement: function(xml){
		 var node = xml.createElement(this.tagName);
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
