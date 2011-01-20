dojo.provide("ajweb.widget.Calendar");
dojo.require("dijit.Calendar");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Calendar",ajweb.widget.Widget,
 {
   createWidget : function(){
     var that = this;
     this.selectedDate = ajweb.date.format(new Date());
     this.widget =  new dijit.Calendar(
       {
	 value: new Date(),
	 onChange: function(date){
//	   console.log("onChange");
	   that.selectedDate = ajweb.date.format(date);
	 },
	 onValueSelected: function(date){
//	   console.log("date Click");
	   that.onDateClick();
	 }
       });
     this.element = this.widget.domNode;
   },
   getSelectedDate: function(){
     return this.selectedDate;
   },
   goToToday: function(){
     
   },
   onDateClick: function(){
   },
   display: function(){
     this.widget.startup();
     this.onDisplay();
   }
 });
