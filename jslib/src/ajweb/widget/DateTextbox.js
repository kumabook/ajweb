dojo.provide("ajweb.widget.DateTextbox");
dojo.require("dijit.form.DateTextBox");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.DateTextbox",ajweb.widget.Widget,
 {
   createWidget : function(){
     var that = this;
     this.widget =  new dijit.form.DateTextBox(
       {
        id: this.id,
        style: {
          position: "absolute",
          top: this.top,
          left: this.left,
          width: this.width
        },
	 value: new Date(),
	 onChange: function(date){
	   that.value = ajweb.date.format(date);
	   that.onChange();
	 }
       });
     this.element = this.widget.domNode;
   },
   getValue: function(){
     return ajweb.date.format(this.widget.value);
   },
   setValue: function(param){
     this.widget.set({value: ajweb.date.parse(param.value)});
   },
   onChange: function(){
   },
   display: function(){
     this.widget.startup();
     this.onDisplay();
   }
 });
