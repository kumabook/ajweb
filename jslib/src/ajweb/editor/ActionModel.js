dojo.require("ajweb.editor.Model");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.FilteringSelect");
dojo.provide("ajweb.editor.ActionModel");

dojo.declare("ajweb.editor.ActionModel", ajweb.editor.Model,
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


		 var tablenameParam = document.createElement("div");
		 tablenameParam.innerHTML = "&nbsp;tablename";
		 tablenameParam.style.position = "absolute";
		 tablenameParam.style.top = "30px";
//		 tablenameParam.style.left = "10px";
		 tablenameParam.style.width = this.properties.width;

		 var stateStore = new dojo.data.ItemFileReadStore(
		   { data:{
		       identifier: "name",
		       label: "name",
		       items: [//tablelistを取得
			 { name: "room" }, { name: "message" }
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
		       width: "60px",
		       top: "0px",
		       right: "0px"
		     },
		     onChange: function(){
		       alert("create paramBox");
		     }
		       //		       borderBottom: "solid 1px black"
		   });
		 tablenameParam.appendChild(filteringSelect.domNode);
		 this.element.appendChild(tablenameParam);



	       },
	       startup: function(){
		 if(this.movable)
		   this.enableDragMove();
		 this.dndEnable();
	       },
	       propertiesViewUpdate: function(){
	       },
	       eventViewUpdate: function(){
	       }
     }
);
