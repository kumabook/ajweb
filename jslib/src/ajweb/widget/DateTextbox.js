dojo.provide("ajweb.widget.DateTextbox");
dojo.require("dijit.form.DateTextBox");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Calendar",ajweb.widget.Widget,
 {
   createWidget : function(){
     var that = this;
     this.widget =  new dijit.form.DateTextBox(
       {
	 value: new Date(),
	 onChange: function(date){
	   that.selectedDate = ajweb.date.format(date);
	   that.onSelectedDateChange();
	 }
       });
     this.element = this.widget.domNode;
   },
   onSelectedDateChange: function(){
   },
   display: function(){
     this.widget.startup();
     this.onDisplay();
   }
 });
