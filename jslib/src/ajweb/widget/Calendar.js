dojo.provide("ajweb.widget.Calendar");
dojo.require("dijit.Calendar");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Calendar",ajweb.widget.Widget,
 {
   createWidget : function(){
     var that = this;
     this.widget =  new dijit.Calendar(
       {
	 value: new Date(),
	 onChange: function(date){
	   that.selectedDate = ajweb.date.format(date);
	   that.onDateClickChange();
	 }
       });
     this.element = this.widget.domNode;
   },
   onDateClick: function(){
   },
   display: function(){
     this.widget.startup();
     this.onDisplay();
   }
 });
