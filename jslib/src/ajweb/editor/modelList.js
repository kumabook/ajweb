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
    name: "application",
    label: "application",
    label_ja: "アプリケーション",
    modelType: "application",
    modelClass: "Application",
    acceptModelType: ["interfaces", "databases", "events"],
    propertyList: ["name"],
    defaultProperties: {}
  },
  {
    name:"interfaces",
    label:"interfaces",
    label_ja:"UIモデル",
    modelType: "interfaces",
    modelClass: "Model",
    acceptModelType: ["widget"],
    propertyList: [],
    defaultProperties: {},
    projLabel: ajweb.resources.interfaces
  },
  {
    name:"databases",
    label:"databases", label_ja:"データモデル",
    modelType: "databases",
    modelClass: "Eventable",
    elementClass: "databases",
    acceptModelType: ["database"],
    propertyList: ["tagName", "id"],
    eventList: [],
    getters: [
      { id: "selectById", name: "selectById", property: "Content", params: [{key: "id", type: "int"}], returnType: "object"},
      { id: "selectByCondition", name: "selectByCondition", params: [{key: "condition", type: "condition", input:{className: "paramCondition"}}], returnType: "objects"},
      { id: "select", name: "select", params: [], returnType: "objects"}
    ],
    setters: [
      { id: "insert", name: "insert",params: [{key: "id", type: "int"}], returnType: "object"},
      { id: "update", name: "update", params: [{key: "condition", type: "condition", returnType: "object"}]},
      { id: "delete", name: "delete", params: [{key: "condition", type: "condition", returnType: "object"}]}
    ],
    defaultProperties: { tagName: "databases"},
    projLabel: ajweb.resources.databases
  },
  {
    name:"events",
    label:"events",label_ja:"イベントモデル",
    modelType: "events",
    modelClass: "Events",
    acceptModelType: ["event"],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    projLabel: ajweb.resources.events
  },


//UIモデル
  {
    name:'label',
    label:'label',label_ja:'ラベル',
    acceptModelType: [],
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Label",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id",
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   "content"],
    eventList: ["onDisplay", "onClick"],
    defaultProperties: { tagName: "label", content: "ラベル" },
    getters: [
      {	id: "getContent", name: "content",  params: [{key: "value", type: "string"}]}
    ],
    setters: [{id: "setContent", name: "setContent", params: [{key: "content", type: "string"}], description: "表示されている内容を変更" }]
  },
  {
    name:'button',
    label:'button',label_ja:'ボタン',
    acceptModelType: [],
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Button",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id",
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   "content"],
    eventList: ["onDisplay", "onClick"],
    defaultProperties: { tagName: "button", width: "100px", height: "50px",content: "ボタン"},
    getters: [
      {id: "getLabel", name: "label",params: []}
    ],
    setters: []
  },
  {
    name:'textbox',
    label:'textbox', label_ja:'テキストボックス',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Textbox",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "width", "top", "left", "content", "placeHolder", "candidateList"],
    eventList: ["onDisplay", "onFocus", "onBlur"],
    defaultProperties: {tagName: "textbox", width: "100px", height: "100px"},
    getters: [
      {	id: "getValue", name: "value", params: [], returnType: "string", description: "テキストボックスに入力されている値を取得" }
    ],
    setters: []
  },
  {
    name:'passwordbox',
    label:'passwordbox', label_ja:'パスワードボックス',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Textbox",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "width", "top", "left", "content"],
    eventList: ["onDisplay", "onFocus", "onBlur"],
    defaultProperties: {tagName: "textbox", width: "100px", height: "100px"},
    getters: [
      {	id: "getValue", name: "value", params: [], returnType: "string", description: "パスワードボックスに入力されている値を取得" }
    ],
    setters: []
  },
  {
    name:'table',
    label:'table', label_ja:'テーブル',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Table",
    acceptModelType: ["th"],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "height", "width", "top", "left"],
    eventList: ["onDisplay"],
    defaultProperties: { tagName: "table", width: "100px", height: "50px"},
    getters: [
      {	id: "getSelectedItem", name: "value", params: [], returnType: "string", description: "選択されている値を取得" },
      {	id: "getSelectedItem", name: "value", params: [], returnType: "string", description: "選択されている値を取得" },
      {	id: "getSelectedItemProperty", name: "value", params: [], returnType: "string", description: "選択されている値を取得" }
    ],
    setters: [
      {id: "load", name: "load",params: [{key: "item", type: "object"}], description: "" },
      {id: "clear", name: "clear",params: [], description: "" },
      {id: "insert", name: "insert",params: [ {key: "item", type: "object"}], description: "" },
      {id: "delete", name: "delete",params: [ {key: "item", type: "object"}], description: "" },
      {id: "update", name: "update",params: [ {key: "item", type: "object"}], description: "" }
    ]
  },
  {
    name:'th',
    label:'th', label_ja:'テーブルヘッダ',
    modelType: "th",
    modelClass: "widget",
    elementClass: "th",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "width", "label", "field"],
    eventList: ["onDisplay"],
    defaultProperties: { tagName: "th", width: "50px", field: "th", label: "th"},
    getters: [],
    setters: []
  },
  {
    name:'selectbox',
    label:'selectbox', label_ja:'セレクトボックス',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "widget",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "top", "left", 
		   {name: "data", input: "selectbox", type: "data", ref: true, refProp: "id"},
		   {name: "label", input: "selectbox", type: "dataproperty", target: "data"}
		  ],
    eventList: ["onDisplay", "onChange"],
    defaultProperties: { tagName: "selectbox"},
    getters: [
      {	id: "getSelectItemProperty", name: "selectItemProperty", 
	params: [{key: "property", type: "string", input:{className:  "stringSelect", type: "data", targetProperty: "data"}}],
	returnType: "dataProperty", description: ""},
      {	id: "getSelectItem", name: "selectItem",  params: [], returnType: "object", description: "" }
    ],
    setters: [
      {	id: "newItem", name: "newItem", params: [{key: "item", type: "object"}], description: ""},
      { id: "clear", name: "clear",params: [], description: "" },
      {	id: "load", name: "load", params: [{key: "datum", type: "objects"}], description: ""}
    ]
  },
  {
    name:'panel',
    label:'panel', label_ja:'パネル',
    modelType: "panel",
    modelClass: "Widget",
    elementClass: "Panel",
    acceptModelType: ["widget"],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "height", "width"],
    eventList: ["onDisplay"],
    defaultProperties: { tagName: "panel", width: "300px", height: "300px"},
    getters: [
      { id: "self", name: "self", params: [], returnType: "element"}
    ],
    setters: []
  },
  {
    name:'frame',
    label:'frame', label_ja:'フレーム',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Frame",
    acceptModelType: ["panel"],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "content", "top", "left", "height", "width"],
    eventList: ["onDisplay"],
    defaultProperties: { tagName: "frame", width: "100px", height: "100px"},
    getters: [
      {	id: "getSelectPanel", name: "selectPanel", params: [], returnType: "string", description: "現在選択されているpanelのidを返す"}
    ],
    setters: [
      {	id: "selectPanel", name: "selectPanel", params: [{key: "panel", type: "element", input: { className: "element", type: "child"}}], description: "idのpanelを選択する"}
    ]
  },
  {
    name:'dialog',
    label:'dialog', label_ja:'ダイアログ',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Widget",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "title", "content", "top", "left", "height", "width"],
    eventList: ["onDisplay", "onShow"],
    defaultProperties: { tagName: "dialog", width: "100px", height: "100px"},
    getters: [],
    setters: [
      {	id: "show", name: "show", params: [], description: "idのpanelを選択する"}
    ]
  },
  //DBモデル
  {
    name: "database",
    label: "database", label_ja: "データベース",
    modelType: "database",
    modelClass: "Database",
    elementClass: "Database",
    acceptModelType: ["property"],
    toolboxType: "database",
    propertyList: ["tagName", "id", "tablename", "type", "dbName", "dbDriver"],
    eventList: ["onChange", "onInsert", "onDelete", "onUpdate"],
    defaultProperties: { tagName: "database", type: "server",
			dbName: "jdbc:derby:work/appName",
			dbDriver: "org.apache.derby.jdbc.EmbeddedDriver"
		       },
    getters: [
      { id: "selectById", name: "selectById", params: [{key: "id", type: "int"}], returnType: "object"},
      { id: "selectByCondition", name: "selectByCondition", params: [{key: "condition", type: "condition", input:{className: "paramCondition"}}], returnType: "objects"},
      { id: "select", name: "select", params: [], returnType: "objects"}
    ],
    setters: [
      { id: "insert", name: "insert",params: [{key: "id", type: "int"}], returnType: "object"},
      { id: "update", name: "update", params: [{key: "condition", type: "condition", returnType: "object"}]},
      { id: "delete", name: "delete", params: [{key: "condition", type: "condition", returnType: "object"}]}
    ]
  },
  {
    name: "property",
    label : "property", label_ja: "プロパティ",
    modelType: "property",
    modelClass: "property",
    elementClass: "property",
    acceptModelType: [],
    toolboxType: "database",
    propertyList: ["name", "type"],
    defaultProperties: {name:"propertyName", type: "int"}
  },
  {
    name: "init",
    modelType: "init",
    modelClass: "Init",
    elementClass: "Init",
    acceptModelType: [],
    propertyList: [],
    defaultProperties: {},
    projLabel: ajweb.resources.initItems
  },
  {
    name: "item",
    modelType: "item",
    modelClass: "Visible",
    elementClass: "Item",
    acceptModelType: [],
    propertyList: [],
    defaultProperties: {}
  },
  {
    name: "initProperty",
    modelType: "initProperty",
    modelClass: "InitProperty",
    elementClass: "InitProperty",
    acceptModelType: [],
    propertyList: ["name", "value", "type"],
    defaultProperties: {}
  },
  //Functionモデル
  {
    name: "event", label: "event", label: "イベント",
    modelType: "event",
    modelClass: "Event",
    elementClass: "Event",
    acceptModelType: ["action", "condition"],
    propertyList: ["tagName", "type", {name: "target", type: "element", ref: true, refProp: "id"}],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "action",
    modelType: "action",
    modelClass: "Action",
    elementClass: "Action",
    acceptModelType: ["func", "condition"],
    propertyList: ["tagName"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "login",
    modelType: "func",
    modelClass: "Login",
    elementClass: "Login",
    acceptModelType: ["param"],
    toolboxType: "action",
    propertyList: ["tagName", "id"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "insert", label:"insert", label_ja: "挿入",
    modelType: "func",
    modelClass: "Func",
    elementClass: "DBFunc",
    acceptModelType: ["param"],
    toolboxType: "action",
    propertyList: ["tagName", "id", "database"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "update", label: "update", label_ja: "更新",
    modelType: "func",
    modelClass: "Func",
    elementClass: "DBFunc",
    acceptModelType: ["param"],
    toolboxType: "action",
    propertyList: ["tagName", "id", "database"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "delete", label: "delete", label_ja: "削除",
    modelType: "func",
    modelClass: "Func",
    elementClass: "DBFunc",
    acceptModelType: ["param"],
    toolboxType: "action",
    propertyList: ["tagName", "id", "database"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "call", label: "call", label_ja: "呼び出し",
    modelType: "func",
    modelClass: "Func",
    elementClass: "Func",
    acceptModelType: ["param"],
    toolboxType: "action",
    propertyList: ["tagName", "id", {name: "element", type: "element", ref: true, refProp: "id"}, "func"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "branch", label: "branch", label_ja: "分岐",
    modelType: "func",
    modelClass: "Branch",
    elementClass: "Branch",
    acceptModelType: ["condition"],
    toolboxType: "event",
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
    propertyList: ["tagName", "id", "name", "type"],
    eventList: [],
    defaultProperties: {name: "key"}
  },
//Value
  {
    name: "int",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "Primitive",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    getters: [
      {id: "direct", name: "direct", params:[{key: "value", type: "int", input:{className: "int"}}]}
    ],
    setters: []
  },
  {
    name: "string",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "Primitive",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    getters: [
      {id: "direct", name: "direct", params:[{key: "value", type: "string", input:{className: "string"}}]},
      {id: "concat", name: "concat", func: "concat", property: "", params: [{key: "first", type: "string"},{key: "second", type: "string"}], returnType: "string" }
    ],
    setters: []
  },
  {
    name: "date",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "Primitive",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    getters: [
      {id: "direct", name: "direct", params:[{key: "base", type: "date", input:{className: "date"}}]},
      {id: "now", name: "now", params:[]}
    ],
    setters: []
  },
  {
    name: "datetime",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "value",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    getters: [
      {id: "direct", name: "direct", params:[{key: "base", type: "datetime", input:{className: "datetime"}}]},
      {id: "now", name: "now", params:[]}
    ],
    setters: []
  },
  {
    name: "stringSelect",
    modelType: "value",
    modelClass: "StringSelect",
    elementClass: "StringSelect",
    acceptModelType: [],
    propertyList: ["type", "target"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "element",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "ElementSelect",
    acceptModelType: [],
    propertyList: ["type", {name: "target", type: "element", ref: true, refProp: "id"}],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "value",
    modelType: "value",
    modelClass: "Value",
    elementClass: "value",
    acceptModelType: [],
    propertyList: [{name: "element", type: "element", ref: true, refProp: "id"}, "funcName", "func", "type"],
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
  {
    name: "paramCondition",
    tagName: "condition",
    modelType: "condition",
    modelClass: "ParamCondition",
    elementClass: "ParamCondition",
    acceptModelType: ["predicate"],
    propertyList: ["operator"],
    eventList: [],
    defaultProperties: {}
  },

//Condition
  {
    name: "condition", label: "condition", label_ja: "条件",
    modelType: "condition",
    modelClass: "Condition",
    elementClass: "Condition",
    acceptModelType: ["predicate"],
    toolboxType: "event",
    propertyList: ["operator"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "and",
    modelType: "predicate",
    modelClass: "Visible",
    elementClass: "PredicateOperator",
    acceptModelType: ["predicate"],
    propertyList: ["right", "left"],
    eventList: [],
    defaultProperties: {}
  },
  {
    name: "or",
    modelType: "predicate",
    modelClass: "Visible",
    elementClass: "PredicateOperator",
    acceptModelType: ["predicate"],
    propertyList: ["right", "left"],
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
  },
  {
    name: "success",
    modelType: "predicate",
    modelClass: "Model",
    elementClass: "Predicate",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  }
];


