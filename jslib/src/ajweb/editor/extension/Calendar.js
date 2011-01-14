dojo.provide("ajweb.editor.extension.Calendar");

ajweb.editor.MODELLIST.push(
  {
    name:'calendar',
    label:'calendar', label_ja:'カレンダー',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Calendar",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "width", "top", "left"],
    eventList: ["onDisplay", "onDateClick"],
    defaultProperties: {tagName: "textbox", width: "100px", height: "100px"},
    getters: [
      {	id: "getSelectedDate", name: "getSelectedDate", params: [], returnType: "date", description: ""}
    ],
    setters: [
      {	id: "goToToday", name: "goToToday", params: [], description: "" }
    ]
  });

dojo.declare("ajweb.editor.element.Calendar",
	     [ajweb.editor.element.Widget],
  {
    createDom: function(properties){
      var that = this;
      this.widget = new dijit.Calendar(
	{style:{position: "absolute",
		top: parseInt(properties.top) + "px",left: parseInt(properties.left)+ "px"}
	});

      return this.widget.domNode;
    },
    updateDom: function(){
      var properties = this.model.properties;
      this.widget.set(
	{style:{top: parseInt(properties.top) + "px",left: parseInt(properties.left)+ "px"}});
    },
    removeDom: function(){
      this.widget.destroyRecursive();
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
      for(var i=0; i<this.widget._connects.length; i++){//イベントを解除
	this.widget.disconnect(this.widget._connects[i]);
      }
    }
  }
);
