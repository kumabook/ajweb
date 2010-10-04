
ajweb.editor.mousePosition = { left: 0, width: 0 };
ajweb.editor.editorCpList = [];

var propertyDataStore;
ajweb.editor.COMLIST =  [
  {
    name:"UI",
    children: [
      {
        name:'label',
	widget_type: "widget",
	acceptComponentType: [],
	propertyList: ["component_type", "id", "content", "top", "left", "height", "width"],
	eventList: []
      },
      {
        name:'button',
	widget_type: "widget",
	acceptComponentType: [],
	propertyList: ["component_type", "id", "content", "top", "left", "height", "width"],
	eventList: ["onClick"]
      },
      {
        name:'textbox',
	widget_type: "widget",
	acceptComponentType: [],
	propertyList: ["component_type","id", "content", "top", "left", "height", "width","palceHolder", "candidate_list"],
	eventList: ["onFocus", "onBlur"]
      },

      {
        name:'table',
	widget_type: "widget",
	acceptComponentType: [],
	propertyList: ["component_type", "id", "top", "left", "height", "width", "data"],
	eventList: ["onClick", "onDbClick", "onCellEdit"]
      },
      {
        name:'panel',
	widget_type: "container",
	acceptComponentType: ["widget"],
	propertyList: ["component_type","id", "content", "top", "left", "height", "width"],
	eventList: ["onLoad"]
      },
      {
        name:'frame',
	widget_type: "container",
	acceptComponentType: ["widget"],
	propertyList: ["component_type", "id", "content", "top", "left", "height", "width"],
	eventList: ["onLoad"]
      }
    ]
  },
  {
    name: "DB",
    children: [
      {
	name: "server",
	widget_type: "database",
	acceptComponentType: ["dbproperty"],
	propertyList: ["component_type", "name", "type"],
	eventList: ["onChange", "onInsert", "onDelete", "onUpdate"]
      },
      {
	name: "client",
	widget_type: "database",
	acceptComponentType: ["dbproperty"],
	propertyList: ["component_type", "name", "type"],
	eventList: ["onChange", "onInsert", "onDelete", "onUpdate"]
      },
      {
	name: "property",
	widget_type: "dbproperty",
	acceptComponentType: []
      }
    ]
  },
  {
    name: "Function",
    children: [
      {
	name: "insert",
	widget_type: "action",
	paramList: ["tableName"]
      },
      {
	name: "update",
	widget_type: "action",
	paramList: ["tableName"]
      },

      {
	name: "delete",
	widget_type: "action",
	paramList: ["tablename"]
      },
      {
	name: "custom",
	widget_type: "action",
	paramList: ["funcName"]
      },
      {
	name: "local",
	widget_type: "action",
	paramList: ["input"]
      },
      {
	name: "param",
	widget_type: "param"
      }
    ]
  }
];
ajweb.editor._COMLIST = ajweb.editor.COMLIST;
//マウスの位置を取得するため
ajweb.editor.getX = function(container) {
  var x = 0;
  while(container) {
    x += container.offsetLeft;
    container = container.offsetParent; 
  }
  return x;
};
ajweb.editor.getY = function(container) {
  var y = 0;
  while(container) {
  y += container.offsetTop;
  container = container.offsetParent; 
  }
  return y;
};

ajweb.editor.currentWidget = null;
dojo.addOnLoad(
  function(){
    dojo.connect(document, "mouseup", function(e){
		   var container = dojo.byId("layoutContainer");
		   ajweb.editor.mousePosition.left = (e.clientX - ajweb.editor.getX(container)) + "px";
		   ajweb.editor.mousePosition.top = (e.clientY - ajweb.editor.getY(container)) + "px";
		   ajweb.editor.mousePosition.x = e.clientX;
		   ajweb.editor.mousePosition.y = e.clientY;
		 });
  }
);
var ajwebEditor = {};

ajweb.editor.getComponentType = function(widgetName){
  for(var i = 0; i < ajweb.editor.COMLIST.length; i++){
    for(var j = 0; j < ajweb.editor.COMLIST[i].children.length; j++){
      if(widgetName == ajweb.editor.COMLIST[i].children[j].name){
	return  ajweb.editor.COMLIST[i].children[j].widget_type[0];
      }	   
    }
  }
  return null;
};
ajweb.editor.getComponent = function(widgetName){
  for(var i = 0; i < ajweb.editor.COMLIST.length; i++){
    for(var j = 0; j < ajweb.editor.COMLIST[i].children.length; j++){
      if(widgetName == ajweb.editor.COMLIST[i].children[j].name){

	return  ajweb.editor._COMLIST[i].children[j];
      }	   
    }
  }
  return null;
};


var modelCount = 1;

ajweb.editor.containerCount = 0;
ajweb.editor.widgetCount = 0;
ajweb.editor.dbCount = 0;
ajweb.editor.propCount = 0;
ajweb.editor.actionCount = 0;

ajweb.editor.createModel = function(component, containerDom, that){
  var top =  ajweb.editor.mousePosition.y - ajweb.editor.getY(containerDom);
  var left =  ajweb.editor.mousePosition.x - ajweb.editor.getX(containerDom);
//  var defaultPropertyList = ["id", "type", "content", "top", "left", "height", "width"];

  if(component.widget_type == "container")
    return new ajweb.editor.Model(
      {
	component_type: component.name,
	id: "container" + ajweb.editor.containerCount++,
	content: component.name,
	width: "100px",
	height: "100px",
	top:  top,
	left : left,
	tagName: component.name,
	resizable: true,
	propertyList: component.propertyList,
	acceptComponentType: ["widget"],
	eventList: component.eventList,
	parentDom: containerDom
      });
  else if(component.widget_type == "widget")
  return new ajweb.editor.Model(
    {
      component_type: component.name,
      id: "widget" + ajweb.editor.widgetCount++,
      content: component.name,
      top:  top,
      left : left,
      width: 50,
      height: 20,
      tagName: component.name,
      propertyList: component.propertyList,
      eventList: component.eventList,
      acceptComponentType: [],
      parentDom: containerDom
    });
  else if(component.widget_type ==  "database")
  return new ajweb.editor.DBModel(
    {
      component_type: "DB("+component.name + ")",
      id: "model" + ajweb.editor.DBCount++,
      content: component.widget_type,
      width: "160px",
      height: "50px",
      top: top,
      left : left,
      name: "tablename" + ajweb.editor.dbCount++,
      tagName: component.name,
      type: component.name,
      propertyList: component.propertyList,
      eventList: component.eventList,
      acceptComponentType: ["dbproperty"],
      parentDom: containerDom
    });
  else if(component.widget_type == "dbproperty"){
    var parentHeight = (parseInt(that.element.style.height) + 25) + "px";
    that.element.style.height = parentHeight;
    that.properties.height = parentHeight;
    return new ajweb.editor.DBPropertyModel(
      {
	component_type: component.name,
	id: "prop" + ajweb.editor.propCount++,
	content: component.widget_type,
	width: containerDom.style.width,
	height: "30px",
	top:  (35 + that.children.length * 25) + "px",
	left : "0px",
	movable: false,
	nodisplayProperty: true,
	tagName: "property",
	propertyList: component.propertyList,
	acceptComponentType: [],
	parentDom: containerDom
      });
  }
  else if(component.widget_type == "action"){
    return new ajweb.editor.ActionModel(
      {
	id: "action" + ajweb.editor.actionCount++,
	width: "200px",
	height: "60px",
	top: top,
	left : left,
	name: component.name + ajweb.editor.actionCount++,
	tagName: component.name,
	type: component.name,
	propertyList: component.propertyList,
	nodisplayProperty: true,
	eventList: component.eventList,
	acceptComponentType: ["param"],
	parentDom: containerDom
      });

  }
  else if(component.widget_type == "param"){
    var parentHeight = (parseInt(that.element.style.height) + 25) + "px";
    that.element.style.height = parentHeight;
    that.properties.height = parentHeight;
    return new ajweb.editor.FuncParamModel(
      {
	component_type: component.name,
	id: "prop" + ajweb.editor.propCount++,
	content: component.widget_type,
	width: containerDom.style.width,
	height: "30px",
	top:  (50 + that.children.length * 25) + "px",
	left : "0px",
	movable: false,
	nodisplayProperty: true,
	tagName: "property",
	propertyList: component.propertyList,
	acceptComponentType: [],
	parentDom: containerDom
      });
  }
  else 
    return null;

};



ajweb.editor.uicount = 0;
ajweb.editor.dbcount = 0;

ajweb.editor.createEditorCp = function(type,treeModel,name){
      var editorCp;
      if(type == "UIModel"){
	if(!name)
	  name = type + ajweb.editor.uicount++;
	editorCp =  new ajweb.editor.EditorCp(
	  {
	    id: name,
	    title: name,
	    acceptComponentType: ["widget", "container"],
	    tagName: "interfaces",
	    propertyList: [],
	    properties: {}
	  }
	);
      }
      else if(type == "DBModel"){
	if(!name)
	  name = type + ajweb.editor.dbcount++;
	editorCp =  new ajweb.editor.EditorCp(
	  {
	    id: name,
	    title: name,
	    acceptComponentType: ["database"],
	    tagName: "databases",
	    propertyList: [],
	    properties: {}
	  }
	);
      }
  ajweb.editor.modelEditor.layoutContainer.addChild(editorCp.widget);
  ajweb.editor.editorCpList.push(editorCp);
  editorCp.startup();
  treeModel.newItem({name: editorCp.id, model_type: type});
  return editorCp;
};
