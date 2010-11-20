dojo.declare("ajweb.editor.Model", null,
	     { 
	       constructor: function(opt)
	       {
		 this.id = opt.id;
		 this.properties = opt;
		 this.propertyList = opt.propertyList;
		 this.tagName = opt.tagName;
		 this.eventList = [];
		 this.eventNameList = opt.eventList;
		 this.acceptComponentType = opt.acceptComponentType;
		 this.label = opt.label;
		 this.children = [];//子要素への参照
		 if(opt.resizable === undefined)
		   this.resizable = false;
		 else 
		   this.resizable = opt.resizable;
		 if(opt.movable === undefined)
		   this.movable = true;
		 else 
		   this.movable = opt.movable;

		 if(opt.parentDom)
		   this.parentDom = opt.parentDom;
		 else 
		   this.parentDom = ajweb.editor.modelEditor.layoutContainer.selectedChildWidget.domNode;
		 this.isDndEnabled = false;
		 this.create();
		 dojo.connect(this.widget.domNode, "onmousedown", this, this.propertiesViewUpdate);
		 dojo.connect(this.widget.domNode, "onmousedown", this, this.eventViewUpdate);

	       },
	       create: function(){
		 this.widget = new dijit.layout.ContentPane(
		   {
		     id : this.id,
		     content: this.properties.content.toString(),
		     style:{ 
		       position: "absolute",
		       width: this.properties.width,
		       height: this.properties.height,
		       top: this.properties.top,
		       left: this.properties.left,
		       backgroundColor: "#E1EBFB",
		       border: "solid 1px #769DC0"
		     },
		     onLoad :function(){
		     //  console.log("Model " + this.id + "  onload");
		     }
		   });
		 this.element = this.widget.domNode;

		 this.deleteArea = document.createElement("div");
		 this.deleteArea.className = "dijitDialogCloseIcon";
		 this.element.appendChild(this.deleteArea);

		 this.eventViewCreate();

	       },
	       propertiesViewUpdate : function(){
		 if(this.properties.nodisplayProperty) return;
		 var container = this.parentDom;
		 var left = ajweb.editor.getX(this.widget.domNode) - ajweb.editor.getX(container) + "px";
		 var top = ajweb.editor.getY(this.widget.domNode) - ajweb.editor.getY(container) + "px";
		 this.properties.top = top;				
		 this.properties.left = left;
		 ajweb.editor.currentWidget = this;
		 ajweb.editor.propertyDataStore.fetch({
			       onComplete: function(items, request){
				 for(var i = 0; i < items.length; i++){
				   ajweb.editor.propertyDataStore.deleteItem(items[i]);
				 }
			       }
			     });
		 for(var i = 0; i < this.propertyList.length; i++){
		   var value = this.properties[this.propertyList[i]];
		   if(!value)
		     value = "";
		   ajweb.editor.propertyDataStore.newItem({
							    property : this.propertyList[i],
							    value: value
							  });
		 }	       
	       },
	       eventViewCreate: function(){

		 for(var i = 0; i < this.eventNameList.length; i++){
		   this.eventList[i] = new ajweb.editor.EventModel(
		     {id: this.id +"_"+ this.eventNameList[i],title:this.eventNameList[i],
		      acceptComponentType:["action"]
		     });
		 }
		 this.eventViewUpdate();
		 for(i = 0; i < this.eventNameList.length; i++){
		   this.eventList[i].startup();
		 }
	       },
	       eventViewUpdate : function(){
		 if(this.properties.nodisplayProperty) return;
		 var i = 0;
		 var children = ajweb.editor.modelEditor.eventTc.getChildren();
		 for( i = 0; i < children.length; i++){
		   ajweb.editor.modelEditor.eventTc.removeChild(children[i]);		  
		 }
//		 ajweb.editor.modelEditor.
		 for(i = 0; i < this.eventList.length; i++){
		   ajweb.editor.modelEditor.eventTc.addChild(this.eventList[i].widget);		  


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
		 this.dndEnable();
//		 console.log( this.id +  "  startup");
		 if(this.movable)
		   this.enableDragMove();
		 if(this.resizable)
		   this.enableDragResize();
		 this.widget.startup();
		 this.update();
		 this.propertiesViewUpdate();
		 
	       },
	       dndEnable : function(){
		 if(this.isDndEnabled)
		   return;
		 var that = this;
		 var acceptComponentType = this.acceptComponentType;

		 var widget = this.widget;

		 var dndwidget = new dojo.dnd.Source(
		   this.id, 
		   {
		     accept: ["text", "treeNode"],
		     checkAcceptance : function(source, nodes){
		       var widgetName = nodes[0].childNodes[2].childNodes[2].innerHTML;
		       var widgetType = ajweb.editor.getComponentType(widgetName);
			if(ajweb.contains(acceptComponentType, widgetType)){
			  this.isDndEnabled = true;
			  return true;
			}
		       return false;
		     },
		     onDrop: function(sources, nodes, copy){
		       var widgetName = nodes[0].childNodes[2].childNodes[2].innerHTML;
		       var component = ajweb.editor.getComponent(widgetName);
		       var newWidget = ajweb.editor.createModel(component, widget.domNode, that);
		       widget.domNode.appendChild(newWidget.element);
		       that.children.push(newWidget);
		       newWidget.startup();
		     }
		   });

	       },
	       enableDragMove: function(){
//		 console.log(this.id + "   enableDragMove");
		 this.drag_move_connection
		   = dojo.connect(this.widget.domNode, "onmousedown", this, 
				  function(e){
//				    console.log(this.id + " regist move");
				    var left = parseInt(this.widget.domNode.style.left) - e.clientX;;
				    var top = parseInt(this.widget.domNode.style.top) - e.clientY;;
				    var container_width = parseInt(this.parentDom.style.width) - parseInt(this.widget.domNode.style.width);
				    var container_height = parseInt(this.parentDom.style.height) - parseInt(this.widget.domNode.style.height);

				    var move = function(e){
				      var _x = e.clientX + left;
				      var _y = e.clientY + top;
				      if(_x < container_width-1 &&  _x > 0){
					this.widget.domNode.style.left = _x + "px";
				      }
				      if(_y < container_height-1 &&  _y > 0){
					this.widget.domNode.style.top = _y + "px";
				      }
//				      console.log("drag move " + _x + "  " + _y);
				    };
				    var move_connection = dojo.connect(document, "onmousemove", this, move);
				    var remove_connection  = dojo.connect(document, "onmouseup", this, function(e){
									    dojo.disconnect(move_connection);
									    dojo.disconnect(remove_connection);
//									    console.log(this.id + " drag end");
									    this.propertiesViewUpdate();
									    e.preventDefault();
									    e.stopPropagation();


									  });
				    e.preventDefault();
				    e.stopPropagation();

				  });



	       },
	       disableDragMove: function(){
		 dojo.disconnect(this.drag_move_connection);
	       },
	       enableDragResize: function(){
		 this.sizeChange = dojo.doc.createElement("div");
		 dojo.style(this.sizeChange, "backgroundColor", "#769DC0");
		 dojo.style(this.sizeChange, "position", "absolute");
 		 dojo.style(this.sizeChange, "bottom", "0px");
		 dojo.style(this.sizeChange, "right", "0px");
		 dojo.style(this.sizeChange, "width", "10px");
		 dojo.style(this.sizeChange, "height", "10px");
		 this.widget.containerNode.appendChild(this.sizeChange);
		 
		 this.drag_resize_connection 
		   = dojo.connect(this.sizeChange, "onmousedown", this, 
				  function(e){
//				    console.log(this.id + " regist resize");
				    var properties = this.properties;
				    var domNode = this.widget.domNode;
				    var x = e.clientX;
				    var y = e.clientY;

				    var width = parseInt(properties.width);
				    var height = parseInt(properties.height);
				    var resize = function(e){
	                              var dx = e.clientX - x;
				      var dy = e.clientY - y;
				      domNode.style.width = (width + dx) + "px";
				      domNode.style.height = (height + dy) + "px";
				      properties.width = (width + dx) + "px";
				      properties.height = (height + dy) + "px";
				    };

				    var move_connection = dojo.connect(document, "onmousemove", null, resize);
				    
				    
				    var remove_connection = dojo.connect(document, "onmouseup", this, function(e){
									   dojo.disconnect(move_connection);
									   dojo.disconnect(remove_connection);
									   
									   this.propertiesViewUpdate();
//									   console.log(this.id + " resize end");
									   
									   e.preventDefault();
									   e.stopPropagation();
									 });
				    e.preventDefault();
				    e.stopPropagation();
				  });

		 
	       },
	       disableDragResize: function(){
		 dojo.disconnect(this.drag_resize_connection);
		 dojo.destory(this.sizeChange);
	       },
	       checkAcceptance: function(widgetType){
		 for(var i = 0; i < this.acceptComponentType.length; i++){
		  if(this.acceptComponentType[i] == widgetType)
		    return true;
		 }
		 return false;
	       },
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
