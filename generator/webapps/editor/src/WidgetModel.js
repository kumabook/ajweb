dojo.declare("ajweb.editor.WidgetModel", ajweb.editor.Model, 
	     { 
	       constructor: function(opt){
		 this.properties_list = ["id", "type", "content", "top", "left", "height", "width"];
	       }
/*	       startup: function(){
//		 this.dndEnable();
		 this.enableDragMove();
	//	 this.enableDragResize();
		 this.widget.startup();
		 this.update();
	       }*/
	     }
);
