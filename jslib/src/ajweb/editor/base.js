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
    children: [{name:'label'},{name:'button'},{name:'textbox'},{name:'table'},{name:'th'},{name:'panel'},{name:'frame'}]
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
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: { tagName: "databases"}
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
    defaultProperties: { tagName: "label", content: "ラベル" }
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
    defaultProperties: { tagName: "button", width: "100px", height: "50px",content: "ボタン"}
  },
  {
    name:'textbox',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Button",
    acceptModelType: [],
    propertyList: ["tagName", "id", "height", "width", "top", "left", "content", "palceHolder", "candidate_list"],
    eventList: ["onLoad", "onFocus", "onBlur"],
    defaultProperties: {tagName: "textbox", width: "100px", height: "100px"}
  },
  
  {
    name:'table',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Table",
    acceptModelType: ["th"],
    propertyList: ["tagName", "id", "height", "width", "top", "left"],
    eventList: ["onLoad", "onClick", "onDbClick", "onCellEdit"],
    defaultProperties: { tagName: "table", width: "100px", height: "50px"}
  },
  {
    name:'th',
    modelType: "th",
    modelClass: "th",
    elementClass: "th",
    acceptModelType: [],
    propertyList: ["tagName", "id", "width"],
    eventList: ["onLoad", "onClick", "onDbClick", "onCellEdit"],
    defaultProperties: { tagName: "th", width: "100px", name: "th", label: "th"}
  },
  {
    name:'panel',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Panel",
    acceptModelType: ["widget"],
    propertyList: ["tagName", "id", "height", "width"],
    eventList: ["onLoad"],
    defaultProperties: { tagName: "panel", width: "300px", height: "300px"}
  },
  {
    name:'frame',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Panel",
    acceptModelType: ["widget"],
    propertyList: ["tagName", "id", "content", "top", "left", "height", "width"],
    eventList: ["onLoad"],
    defaultProperties: { tagName: "frame", width: "300px", height: "300px"}
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
    defaultProperties: { tagName: "database", type: "server",
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
    name: "event",
    modelType: "event",
    modelClass: "Event",
    elementClass: "Event",
    acceptModelType: ["action"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "insert",
    modelType: "action",
    modelClass: "Action",
    elementClass: "Action",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "update",
    modelType: "action",
    modelClass: "Action",
    elementClass: "Action",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  
  {
    name: "delete",
    modelType: "action",
    modelClass: "Action",
    elementClass: "Action",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "value",
    modelType: "action",
    modelClass: "Action",
    elementClass: "Action",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "param",
    modelType: "param",
    modelClass: "Param",
    elementClass: "Param",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
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
	      { name: "int" }, { name: "string" }, { name: "password" },{ name: "date" },{name: "datetime"}
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
