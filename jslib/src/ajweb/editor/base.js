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
    children: [{name: "database"},{name: "property"}]
  },
  {
    name: "Function",
    children: [{name: "insert"},{name: "update"},{name: "delete"},{name: "custom"},{name: "local"},{name: "param"}]
  }
];
/**
 * 各モデルの詳細を保持する配列。<br/>
 * name: モデルの名前、XMLのタグ名。コンポーネントのリストのnameと対応。<br/>
 * modelType: モデルのタイプ。<br/>
 * modelClass: モデルのオブジェクトのクラス名。ajweb.editor.model.[] に対応。<br/>
 * elementClass: モデルが上に表示される場合、モデルを表すDOMElementのタイプ。ajweb.editor.element.[]に対応。optional<br/>
 * propertyList: プロパティエディタに表示する、および、生成するXMLに含めるプロパティのリスト。<br/>
 * defaultProperties: デフォルトのプロパティの値。optional<br/>
 * eventList: イベントを持つ場合、取り得るイベントのリスト。optional。<br/>
 * acceptModelType: 子要素に持てるコンポーネントのリスト。<br/>
 */
ajweb.editor.MODELLIST =  [
  {
    name:"application",
    modelType: "application",
    modelClass: "Model",
    acceptModelType: ["interfaces", "databases", "events"],
    propertyList: ["name"],
    defaultProperties: {}
  },
  {
    name:"interfaces",
    modelType: "interfaces",
    modelClass: "Model",
    acceptModelType: ["widget"],
    propertyList: [],
    defaultProperties: {}
  },
  {
    name:"databases",
    modelType: "databases",
    modelClass: "Eventable",
    elementClass: "databases",
    acceptModelType: ["database"],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name:"events",
    modelType: "events",
    modelClass: "Model",
    acceptModelType: ["event"],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },


//UIモデル
  {
    name:'label',
    acceptModelType: [],
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Label",
    acceptModelType: [],
    propertyList: ["tagName", "id", "top", "left", "content"],
    eventList: ["onLoad", "onClick"],
    defaultProperties: {
      tagName: "label",
      content: "ラベル"

    }
  },
  {
    name:'button',
    acceptModelType: [],
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Button",
    acceptModelType: [],
    propertyList: ["tagName", "id", "top", "left", "content"],
    eventList: ["onLoad", "onClick"],
    defaultProperties: {
      tagName: "button",
      width: "100px",
      height: "50px",
      content: "ボタン"
    }
  },
  {
    name:'textbox',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Button",
    acceptModelType: [],
    propertyList: ["tagName", "id", "height", "width", "top", "left", "content", "palceHolder", "candidate_list"],
    eventList: ["onLoad", "onFocus", "onBlur"],
    defaultProperties: {
      tagName: "textbox",
      width: "100px",
      height: "100px"
    }
  },
  
  {
    name:'table',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Widget",
    acceptModelType: ["th"],
    propertyList: ["tagName", "id", "height", "width", "top", "left"],
    eventList: ["onLoad", "onClick", "onDbClick", "onCellEdit"],
    defaultProperties: {
      tagName: "table",
      width: "100px",
      height: "50px"
    }
  },
  {
    name:'panel',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Panel",
    acceptModelType: ["widget"],
    propertyList: ["tagName", "id", "height", "width"],
    eventList: ["onLoad"],
    defaultProperties: {
      tagName: "panel",
      width: "300px",
      height: "300px"
    }
  },
  {
    name:'frame',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Panel",
    acceptModelType: ["widget"],
    propertyList: ["tagName", "id", "content", "top", "left", "height", "width"],
    eventList: ["onLoad"],
    defaultProperties: {
      tagName: "frame",
      width: "300px",
      height: "300px"
    }
  },
  //DBモデル
  {
    name: "database",
    modelType: "database",
    modelClass: "Database",
    elementClass: "Database",
    acceptModelType: ["property"],
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
    name: "property",
    modelType: "property",
    modelClass: "property",
    elementClass: "property",
    acceptModelType: [],
    propertyList: ["name", "type"],
    defaultProperties: {name:"propertyName", type: "int"}
  },
  //Functionモデル
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
/**
 * モデルの情報を保持するオブジェクト取得。
 * @param {String} name モデルの名前
 */
ajweb.editor.getModelInfo = function(name){
  for(var i = 0; i < ajweb.editor.MODELLIST.length; i++){
      if(name == ajweb.editor.MODELLIST[i].name){
	return  ajweb.editor.MODELLIST[i];
      }
  }
  return null;
};

ajweb.editor.modelCounter = {};
/**
 * モデルのidが衝突しないようにモデルが生成された数を返す。
 * @param {String} tagName  モデル名
 */
ajweb.editor.modelCount = function(tagName){
  if(ajweb.editor.modelCounter[tagName] == undefined){
    ajweb.editor.modelCounter[tagName] = 0;
  }
  return ajweb.editor.modelCounter[tagName]++;
};

/**
 * モデル名からモデルの情報を参照してモデルオブジェクトを作成する。
 * @param {String} name モデル名
 * @param {Object} properties プロパティのハッシュ
 * @param {ajweb.editor.model.Model} parent 親ウィジェット
 * @param {ajweb.editor.element.ModelElement|dijit.layout.TabContainer} container 配置するDOM要素を保持するオブジェクト
 * @param {dojo.data.ItemFileReadStore} propertyDataStore 表示するプロパティを保持するdojoストア
 * @param {dijit.layout.TabContainer} eventTc イベントリストを保持するcenterTc
 */
ajweb.editor.createModel = function(name, properties, parent, container){
  var modelInfo = ajweb.editor.getModelInfo(name);
  var elementClass = modelInfo.elementClass;
  var modelClass = modelInfo.modelClass;
  var ModelClass = modelClass.substr(0,1).toLocaleUpperCase() + modelClass.substr(1);
  var propertyList = dojo.clone(modelInfo.propertyList);
  var defaultProperties = dojo.clone(modelInfo.defaultProperties);

  if(properties){
    if(!properties.id)
      properties.id = name + ajweb.editor.modelCount(name);
    propertyList.push("id");
    propertyList.push("top");
    propertyList.push("left");
      
    for(var i = 0; i < propertyList.length; i++){
      if(properties[propertyList[i]])
	defaultProperties[propertyList[i]] = properties[propertyList[i]];
    }
  }

  var newModel =  new ajweb.editor.model[ModelClass](
    {
      id: properties.id,
      tagName: name,
      acceptModelType: modelInfo.acceptModelType,
      elementClass: elementClass,
      properties: defaultProperties,
      propertyList: modelInfo.propertyList,
      eventList: modelInfo.eventList,
      parent: parent,
      container: container,
      editor: parent.editor
    }
  );

  if(name == "databases" || name == "panel"){
    parent.editor.projectTreeModel.getRoot(
      function(item){
	    parent.editor.projectTreeModel.getChildren(
	      item,
	      function(items){
		for(var i = 0; i < items.length; i++){
		  if(items[i].name == parent.editor.application.properties.appName){
		    parent.editor.projectTreeModel.getChildren(
		      items[i],
		      function(_items){
			for(var j = 0; j < _items.length; j++){
			  if(_items[j].modelType == "databases" && name == "databases")
			    parent.editor.projectTreeModel.newItem(
			      {name: properties.id, modelType: name, modelId: properties.id}, _items[j]
			    );
			  else if(_items[j].modelType == "interfaces" && name == "panel")
			    parent.editor.projectTreeModel.newItem(
			      {name: properties.id, modelType: name, modelId: properties.id}, _items[j]
			    );
			}
		      },
		      function(error){
		      }
		    );
		  }
		}
	      },
	      function(error){
	      }
	    );
      });
  }
  newModel.startup();
  return newModel;
};

ajweb.editor.modelToXml = function(model){
  var xml = ajweb.xml.createDocument("ajml");
  var rootElement = xml.documentElement;
  var applicationElement = model.toXMLElement(xml);
  rootElement.appendChild(applicationElement);
  return xml;
};

ajweb.editor.modelToSaveXml = function(model){
  var xml = ajweb.xml.createDocument("ajml");
  var rootElement = xml.documentElement; 
  var applicationElement = model.toSaveXMLElement(xml);
  rootElement.appendChild(applicationElement);
  return xml;
};
