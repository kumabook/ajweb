dojo.provide("ajweb.editor.AttributeModel");
dojo.require("ajweb.editor.Model");
dojo.declare("ajweb.editor.AttributeModel", null, 
	     { 
	       constructor: function(opt, property_store){
		 this.properties_list = ["id", "type", "label", "top", "left", "height", "width"];

		this.label = opt.label;
		this.top = opt.top;
		this.left = opt.left;
		this.height = opt.height;
		this.width = opt.width;
		this.enable = opt.enable;
		this.onclick = opt.onclick;		
		 this.parent = opt.parent;
		this.widget= new dijit.form.Button({ 
			id: this.id,
			label: this.label,
			style:{ 
			  position: "absolute",
			  width: this.width  + "px",
			  height: this.height + "px",
			  top: this.top + "px",
			  left: this.left + "px"
			}
		});

		 this.properties = { 
		   id: "widgetModel",
		   type: opt.type,
		   width: "100px",
		   height: "100px",
		   top: this.top + "px",
		   left: this.left + "px"

		 };

		 this.element = this.widget.domNode;



		 this.property_store = property_store;

		 dojo.connect(this.widget.domNode, "onmousedown", this, function(e){
				isTargetWidget = true;
			      });
		 dojo.connect(this.widget.domNode, "onmouseup", this, function(e){

				var container = this.parent.domNode;
				var left = (getX(this.widget.domNode) - getX(container) + 1) + "px";
				var top = (getY(this.widget.domNode) - getY(container) + 1) + "px";
			      
				this.properties.top = top;				
				this.properties.left = left;				
				this.propertiesViewUpdate();
				isTargetWidget = false;

			      });

	       },
	       propertiesViewUpdate : function(){
		 ajweb.currentWidget = this;
		 propertyDataStore.fetch({
			       onComplete: function(items, request){
				 for(var i = 0; i < items.length; i++){
				   propertyDataStore.deleteItem(items[i]);
				 }
			       }
			     });
		 propertyDataStore.fetch({
			       onComplete: function(items, request){
			       }
			     });
		 for(var i = 0; i < this.properties_list.length; i++){
		   propertyDataStore.newItem(
		     {
		       property : this.properties_list[i], 
		       value: this.properties[this.properties_list[i]]
		     });
		 }

	       },
	       update: function(){
		 var widget = this.widget.domNode;

		 widget.style.position = "absolute";
		 widget.style.width = parseInt(this.properties.width) + "px";
		 widget.style.height = parseInt(this.properties.height) + "px";
		 widget.style.top = parseInt(this.properties.top) + "px";
		 widget.style.left = parseInt(this.properties.left) + "px";

	       },
	       startup: function(){
		 new dojo.dnd.Moveable(this.element);
	       }
	     }
);
