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
    children: [{name: "insert"},{name: "update"},{name: "delete"},{name: "setValue"},{name: "branch"},{name: "then"},{name: "else"},{name: "param"}]
  },
  {
    name: "Value",
    children: [{name: "int"},{name: "string"},{name: "date"},{name: "datetime"},{name: "getValue"},{name: "select"}]
  },
  {
    name: "Condition",
    children: [{name: "condition"},{name: "and"},{name: "or"},{name: "not"},{name: "eq"},{name: "lt"},{name: "gt"}]
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
    defaultProperties: {},
    label: "UIモデル"
  },
  {
    name:"databases",
    modelType: "databases",
    modelClass: "Eventable",
    elementClass: "databases",
    acceptModelType: ["database"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: { tagName: "databases"},
    label: "データモデル"
  },
  {
    name:"events",
    modelType: "events",
    modelClass: "Model",
    acceptModelType: ["event"],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    label: "イベントモデル"
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
    elementClass: "Frame",
    acceptModelType: ["widget"],
    propertyList: ["tagName", "id", "content", "top", "left", "height", "width"],
    eventList: ["onLoad"],
    defaultProperties: { tagName: "frame", width: "100px", height: "100px"}
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
    propertyList: ["tagName", "id", "type", "target"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "action",
    modelType: "action",
    modelClass: "Action",
    elementClass: "Action",
    acceptModelType: ["func"],
    propertyList: ["tagName"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "insert",
    modelType: "func",
    modelClass: "Func",
    elementClass: "Func",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "update",
    modelType: "func",
    modelClass: "Func",
    elementClass: "Func",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "delete",
    modelType: "func",
    modelClass: "Func",
    elementClass: "Func",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "setValue",
    modelType: "func",
    modelClass: "Func",
    elementClass: "Func",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "branch",
    modelType: "func",
    modelClass: "Func",
    elementClass: "Branch",
    acceptModelType: ["condition"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "then",
    modelType: "func",
    modelClass: "Func",
    elementClass: "Then",
    acceptModelType: ["func"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {},
    paramList: ["tableName"]
  },
  {
    name: "else",
    modelType: "func",
    modelClass: "Func",
    elementClass: "Then",
    acceptModelType: ["func"],
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
    propertyList: ["tagName", "id", "name"],
    eventList: [],
    defaultProperties: {name: "key"},
    paramList: ["tableName"]
  },
//Value
  {
    name: "int",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "value",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "string",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "value",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "date",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "value",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "datetime",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "value",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "getValue",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "value",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "select",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "value",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },


//Condition
  {
    name: "condition",
    modelType: "condition",
    modelClass: "Visible",
    elementClass: "Condition",
    acceptModelType: ["predicate"],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "and",
    modelType: "predicate",
    modelClass: "Visible",
    elementClass: "PredicateOperator",
    acceptModelType: ["predicate"],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "or",
    modelType: "predicate",
    modelClass: "Visible",
    elementClass: "PredicateOperator",
    acceptModelType: ["predicate"],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "not",
    modelType: "predicate",
    modelClass: "Visible",
    elementClass: "PredicateOperator",
    acceptModelType: ["condition"],
    propertyList: ["predicate"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "eq",
    modelType: "predicate",
    modelClass: "Visible",
    elementClass: "Predicate",
    acceptModelType: ["value"],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "lt",
    modelType: "predicate",
    modelClass: "Visible",
    elementClass: "Predicate",
    acceptModelType: ["value"],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "gt",
    modelType: "predicate",
    modelClass: "Visible",
    elementClass: "Predicate",
    acceptModelType: ["value"],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
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
ajweb.editor.attributesToHash = function(attributes){
  var attrs = {};
  for(var i = 0; i < attributes.length; i++){
    attrs[attributes[i].name] = attributes[i].value;
  }
  return attrs;
};
