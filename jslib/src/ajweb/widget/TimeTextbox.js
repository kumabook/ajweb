dojo.provide("ajweb.widget.TimeTextbox");
dojo.require("dijit.form.TimeTextBox");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.TimeTextbox",ajweb.widget.Widget,
 {
   createWidget : function(){
     var that = this;
     this.widget =  new dijit.form.TimeTextBox(
       {
	 value: new Date(),
        id: this.id,
        style: {
          position: "absolute",
          top: this.top,
          left: this.left,
          width: this.width
        },
	 onChange: function(date){
	   that.onChange();
	 }
       });
     this.element = this.widget.domNode;
   },
   getValue: function(){
     return ajweb.time.format(this.widget.value);
   },
   setValue: function(param){
     var time;
     if(!param.value)
       time = new Date();
     else 
       ajweb.time.parse(param.value);
     this.widget.set({value: time});
   },

   onChange: function(){
   },
   display: function(){
     this.widget.startup();
     this.onDisplay();
   }
 });
