dojo.provide("ajweb.editor.modelList");
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
    eventList: ["onDisplay", "onClick"],
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
    eventList: ["onDisplay", "onClick"],
    defaultProperties: { tagName: "button", width: "100px", height: "50px",content: "ボタン"}
  },
  {
    name:'textbox',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Textbox",
    acceptModelType: [],
    propertyList: ["tagName", "id", "width", "top", "left", "content", "palceHolder", "candidate_list"],
    eventList: ["onDisplay", "onFocus", "onBlur"],
    defaultProperties: {tagName: "textbox", width: "100px", height: "100px"}
  },
  {
    name:'table',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Table",
    acceptModelType: ["th"],
    propertyList: ["tagName", "id", "height", "width", "top", "left"],
    eventList: ["onDisplay", "onClick", "onDbClick", "onCellEdit"],
    defaultProperties: { tagName: "table", width: "100px", height: "50px"}
  },
  {
    name:'th',
    modelType: "th",
    modelClass: "widget",
    elementClass: "th",
    acceptModelType: [],
    propertyList: ["tagName", "id", "width", "label", "field"],
    eventList: ["onDisplay"],
    defaultProperties: { tagName: "th", width: "50px", name: "th", label: "th"}
  },
  {
    name:'selectbox',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "widget",
    acceptModelType: [],
    propertyList: ["tagName", "id", "top", "left"],
    eventList: ["onDisplay", "onChange"],
    defaultProperties: { tagName: "selectbox"}
  },
  {
    name:'panel',
    modelType: "panel",
    modelClass: "Widget",
    elementClass: "Panel",
    acceptModelType: ["widget"],
    propertyList: ["tagName", "id", "height", "width"],
    eventList: ["onDisplay"],
    defaultProperties: { tagName: "panel", width: "300px", height: "300px"}
  },
  {
    name:'frame',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Frame",
    acceptModelType: ["panel"],
    propertyList: ["tagName", "id", "content", "top", "left", "height", "width"],
    eventList: ["onDisplay"],
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
    defaultProperties: {}
  },
  {
    name: "action",
    modelType: "action",
    modelClass: "Action",
    elementClass: "Action",
    acceptModelType: ["func"],
    propertyList: ["tagName"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "insert",
    modelType: "func",
    modelClass: "Func",
    elementClass: "DBFunc",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id", "database"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "update",
    modelType: "func",
    modelClass: "Func",
    elementClass: "DBFunc",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id", "database"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "delete",
    modelType: "func",
    modelClass: "Func",
    elementClass: "DBFunc",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id", "database"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "call",//call
    modelType: "func",
    modelClass: "Func",
    elementClass: "Func",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id", "element", "fuc"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "branch",
    modelType: "func",
    modelClass: "Branch",
    elementClass: "Branch",
    acceptModelType: ["condition"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "then",
    modelType: "func",
    modelClass: "Action",
    elementClass: "Then",
    acceptModelType: ["func"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "else",
    modelType: "func",
    modelClass: "Action",
    elementClass: "Then",
    acceptModelType: ["func"],
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "param",
    modelType: "param",
    modelClass: "Param",
    elementClass: "Param",
    acceptModelType: ["param"],
    propertyList: ["tagName", "id", "name"],
    eventList: [],
    defaultProperties: {name: "key"}
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
    name: "value",
    modelType: "value",
    modelClass: "Value",
    elementClass: "value",
    acceptModelType: [],
    propertyList: ["element", "property"],
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