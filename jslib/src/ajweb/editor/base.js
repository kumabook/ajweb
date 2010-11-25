dojo.require("ajweb.base");
dojo.require("ajweb.xml");
dojo.require("dojo.data.ItemFileReadStore");
dojo.provide("ajweb.editor.base");

ajweb.editor.mousePosition = { left: 0, width: 0 };

var propertyDataStore;
/**
 * コンポーネントのリスト
 */
ajweb.editor.COMLIST =  [
  {
    name:"UI",
    children: [{name:'label'},{name:'button'},{name:'textbox'},{name:'table'},{name:'panel'},{name:'frame'}]
  },
  {
    name: "DB",
    children: [{name: "server"},{name: "client"},{name: "property"}]
  },
  {
    name: "Function",
    children: [{name: "insert"},{name: "update"},{name: "delete"},{name: "custom"},{name: "local"},{name: "param"}]
  }
];
/**
 * 各コンポーネントの詳細、
 * name: コンポーネントの名前、XMLのタグ名。コンポーネントのリストのnameと対応。
 * modelType: 内部的なモデルオブジェクトのタイプ。ajweb.editor.model.[] に対応。
 * elementType: 内部的なモデルを表すDOMElementのタイプ。ajweb.editor.element.[]に対応。
 * propertyList: プロパティエディタに表示する、および、生成するXMLに含めるプロパティのリスト。
 * defaultProperties: デフォルトのプロパティの値。
 * eventList: イベントを持つ場合、取り得るイベントのリスト。
 * acceptComponentType: 子要素に持てるコンポーネントのリスト
 */
ajweb.editor._COMLIST =  [
  {
    name:"UI",
    children: [
      {
        name:'label',
	acceptComponentType: [],
	defaultProperties: {

	},
	propertyList: ["tagName", "id", "content", "top", "left", "height", "width"],
	eventList: []
      },
      {
        name:'button',
	acceptComponentType: [],
	propertyList: ["tagName", "id", "content", "top", "left", "height", "width"],
	eventList: ["onClick"]
      },
      {
        name:'textbox',
	acceptComponentType: [],
	propertyList: ["tagName","id", "content", "top", "left", "height", "width","palceHolder", "candidate_list"],
	eventList: ["onFocus", "onBlur"]
      },

      {
        name:'table',
	acceptComponentType: [],
	propertyList: ["tagName", "id", "top", "left", "height", "width", "data"],
	eventList: ["onClick", "onDbClick", "onCellEdit"]
      },
      {
        name:'panel',
	modelType: "widget",
	elementType: "panel",
	acceptComponentType: ["widget"],
	propertyList: ["tagName", "id", "content",  "height", "width"],
	eventList: ["onLoad"],
	defaultProperties: {
	  tagName: "panel",
	  width: "500px",
	  height: "500px"
	  }
      },
      {
        name:'frame',
	acceptComponentType: ["widget"],
	propertyList: ["tagName", "id", "content", "top", "left", "height", "width"],
	eventList: ["onLoad"]
      }
    ]
  },
  {
    name: "DB",
    children: [
      {
	name: "server",
	modelType: "database",
	elementType: "database",
	acceptComponentType: ["property"],
	propertyList: ["tagName", "id", "tablename", "type", "dbName", "dbDriver"],
	eventList: ["onChange", "onInsert", "onDelete", "onUpdate"],
	defaultProperties: {
	  tagName: "database",
	  type: "server",
	  dbName: "jdbc:derby:work/appName",
	  dbDriver: "org.apache.derby.jdbc.EmbeddedDriver"
	  }
      },
      {
	name: "client",
	acceptComponentType: ["property"],
	propertyList: ["component_type", "name", "type"],
	eventList: ["onChange", "onInsert", "onDelete", "onUpdate"]
      },
      {
	name: "property",
	modelType: "property",
	elementType: "property",
	acceptComponentType: [],
	propertyList: ["tagName", "name", "type"],
	defaultProperties: {name:"propertyName", type: "int"}
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

/**
 * ajwebでサポートされる型を保持するdojoストア
 */
ajweb.editor.dataTypeStore = new dojo.data.ItemFileReadStore(
	{
	  data:{
	    identifier: "name",
	    label: "name",
	    items: [
	      { name: "int" }, { name: "string" },{ name: "date" },{name: "datetime"}
	    ]
	  }
	});

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
      var container = dojo.byId("centerTc");
      ajweb.editor.mousePosition.left = (e.clientX - ajweb.editor.getX(container)) + "px";
      ajweb.editor.mousePosition.top = (e.clientY - ajweb.editor.getY(container)) + "px";
      ajweb.editor.mousePosition.x = e.clientX;
      ajweb.editor.mousePosition.y = e.clientY;
      });
  }
);
var ajwebEditor = {};


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
ajweb.editor.modelCounter = {};
ajweb.editor.modelCount = function(tagName){
  if(ajweb.editor.modelCount[tagName] == undefined){
    ajweb.editor.modelCount[tagName] = 0;
  }
  return ajweb.editor.modelCount[tagName]++;
};

ajweb.editor.uicount = 0;
ajweb.editor.dbcount = 0;
/**
 * モデル名からモデルの情報を参照してモデルオブジェクトを作成する。
 * @param {String} name モデル名
 * @param {ajweb.editor.model.Model} parent 親ウィジェット
 * @param {ajweb.editor.element.ModelElement|dijit.layout.TabContainer} 配置するDOM要素を保持するオブジェクト
 * @param {dojo.data.ItemFileReadStore} 表示するプロパティを保持するdojoストア
 * @param {dijit.layout.TabContainer} イベントリストを保持するcenterTc
 */
ajweb.editor.createModel = function(name, parent, container, propertyDataStore, eventTc){
  var component = ajweb.editor.getComponent(name);
  var elementType = component.elementType;
  var model = component.modelType;

  var Model = model.substr(0,1).toLocaleUpperCase() + model.substr(1);
  var top =  ajweb.editor.mousePosition.y - ajweb.editor.getY(container.domNode);
  var left =  ajweb.editor.mousePosition.x - ajweb.editor.getX(container.domNode);
  var id = name + ajweb.editor.modelCount(name);
  var properties = dojo.clone(component.defaultProperties);
  properties.top = top;
  properties.left = left;
  properties.id = id;

  return new ajweb.editor.model[Model](
    {
      id: id,
      tagName: name,
      elementType: elementType,
      properties: properties,
      propertyList: component.propertyList,
      propertyDataStore: propertyDataStore,
      eventList: component.eventList,
      eventTc: eventTc,
      acceptComponentType: component.acceptComponentType,
      parent: parent,
      container: container
    }
  );
};

ajweb.editor.generate = function(output_type){
  alert(output_type);
  var xml_str = '<?xml version="1.0" encoding="UTF-8"?>'
	      + '<ajml>'

	      + '</ajml>';

  var xml = dojox.xml.parser.parse(xml_str);
  var rootElement = xml.documentElement;
  var applicationElement = xml.createElement("application");
  rootElement.appendChild(applicationElement);

  for(var i = 0; i < ajweb.editor.editorCpList.length; i++){
    var model = ajweb.editor.editorCpList[i];
    var element = model.getXMLElement(xml);

    applicationElement.appendChild(element);
    //alert(ajweb.editor.editorCpList[i].id);
  }

  var content = ajweb.xml.serialize(xml);

  ajweb.editor.modelEditor.ajmlFilename.setValue("hello");
  ajweb.editor.modelEditor.ajmlTextArea.setValue(content);
  ajweb.editor.modelEditor.outputType.setValue(output_type);


  ajweb.editor.form.submit();
//  ajweb.editor.form.execute();

};



