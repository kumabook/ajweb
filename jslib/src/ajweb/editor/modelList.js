dojo.provide("ajweb.editor.modelList");
dojo.requireLocalization("ajweb.editor", "resources");



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
    elementClass: "Application",
    acceptModelType: ["interfaces", "databases", "events"],
    propertyList: ["name", "isComet", "sessionTimeout",
		   "longPollingTimeout", "longPollingInterval",
		   "pollingInterval", "jslibLocation", "_isDisplay"],
    container: "layout",
    defaultProperties: {isComet: "true", sessionTimeout: 30, longPollingTimeout: 60000, longPollingInterval: 1,
		       pollingInterval: 3000, jslibLocation: "../jslib/" }
  },
  {
    name:"interfaces",
    label:"interfaces",
    label_ja:"UIモデル",
    modelType: "interfaces",
    modelClass: "Model",
    acceptModelType: ["widget"],
    propertyList: [],
    defaultProperties: {}
  },
  {
    name:"databases",
    label:"databases", label_ja:"データモデル",
    modelType: "databases",
    modelClass: "Eventable",
    elementClass: "databases",
    acceptModelType: ["database"],
    container: "layout",
    propertyList: ["tagName", "id", "_isDisplay"],
    eventList: [],
    getters: [],
    setters: [],
    defaultProperties: { tagName: "databases"}
  },
  {
    name:"events",
    label:"events",label_ja:"イベントモデル",
    modelType: "events",
    modelClass: "Events",
    acceptModelType: ["event"],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
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
      {	name: "getContent", label: "getContent",  params: [{key: "value", type: "string"}]}
    ],
    setters: [{name: "setContent", label: "setContent", params: [{key: "content", type: "string"}], description: "表示されている内容を変更" }]
  },
/*  {
    name:'text',
    label:'text',label_ja:'ラベル',
    acceptModelType: [],
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Text",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id",
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   {name: "width", input: "number", type: "int"},
		   {name: "height", input: "number", type: "int"},
		   "content"],
    eventList: ["onDisplay", "onClick"],
    defaultProperties: { tagName: "text", content: "テキスト" , width: "100px", height: "100px"},
    getters: [
      {	name: "getContent", label: "getContent",  params: [{key: "value", type: "string"}]}
    ],
    setters: [{name: "setContent", label: "setContent", params: [{key: "content", type: "string"}], description: "表示されている内容を変更" }]
  },*/
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
      {name: "getLabel", label: "label",params: []}
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
    propertyList: ["tagName", "id", 
		   {name: "width", input: "number", type: "int"},
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   "value", "placeHolder", "candidateList"],
    eventList: ["onDisplay", "onFocus", "onBlur"],
    defaultProperties: {tagName: "textbox", width: "150px", height: "20px"},
    getters: [
      {	name: "getValue", label: "getValue", params: [], returnType: "string", description: "テキストボックスに入力されている値を取得" }
    ],
    setters: [
      {name: "setValue", label: "setValue", params: [{key: "value", type: "string"}], description: "表示されている内容を変更" }]
  },
  {
    name:'textarea',
    label:'textarea', label_ja:'テキストエリア',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Textarea",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id", 
		   {name: "height", input: "number", type: "int"},
		   {name: "width", input: "number", type: "int"},
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		    "value"],
    eventList: ["onDisplay", "onFocus", "onBlur"],
    defaultProperties: {tagName: "textarea", width: "150px", height: "100px"},
    getters: [
      {	name: "getValue", label: "getValue", params: [], returnType: "string", description: "テキストボックスに入力されている値を取得" }
    ],
    setters: [
      {name: "setValue", label: "setValue", params: [{key: "value", type: "string"}], description: "表示されている内容を変更" }]
  },
  {
    name:'passwordbox',
    label:'passwordbox', label_ja:'パスワードボックス',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Textbox",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id",
		   {name: "width", input: "number", type: "int"},
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   "content"],
    eventList: ["onDisplay", "onFocus", "onBlur"],
    defaultProperties: {tagName: "passwordbox", width: "150px", height: "100px"},
    getters: [
      {	name: "getValue", label: "getValue", params: [], returnType: "string", description: "パスワードボックスに入力されている値を取得" }
    ],
    setters: []
  },
  {
    name:'dateTextbox',
    label:'dateTextbox', label_ja:'日付用テキストボックス',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Textbox",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id",
		   {name: "width", input: "number", type: "int"},
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   "value"],
    eventList: ["onDisplay", "onChange"],
    defaultProperties: {tagName: "dateTextbox", width: "100px", height: "100px"},
    getters: [
      {	id: "getValue", name: "value", params: [], returnType: "string", description: "入力されている値を取得" }
    ],
    setters: [
      {name: "setValue", label: "setValue", params: [{key: "value", type: "date"}], description: "表示されている内容を変更" }
    ]
  },
  {
    name:'timeTextbox',
    label:'timeTextbox', label_ja:'時刻テキストボックス',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Textbox",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id",
		   {name: "width", input: "number", type: "int"},
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"}
		  ],
    eventList: ["onDisplay", "onChange"],//onFocus", "onBlur"],
    defaultProperties: {tagName: "timeTextbox", width: "100px", height: "100px"},
    getters: [
      {	id: "getValue", name: "value", params: [], returnType: "string", description: "入力されている値を取得" }
    ],
    setters: [
      {name: "setValue", label: "setValue", params: [{key: "value", type: "time"}], description: "表示されている内容を変更" }
    ]
  },
  {
    name:'table',
    label:'table', label_ja:'テーブル',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Table",
    acceptModelType: ["th"],
    toolboxType: "widget",
    propertyList: ["tagName", "id", 
		   {name: "height", input: "number", type: "int"},
		   {name: "width", input: "number", type: "int"},
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   {name: "data", input: "selectbox", type: "data", ref: true, refProp: "id"}],
    eventList: ["onDisplay"],
    defaultProperties: { tagName: "table", width: "100px", height: "50px"},
    getters: [
      {	name: "getSelectedItem", label: "getSelectedItem", params: [], returnType: "string", description: "選択されている値を取得" },
      {	name: "getSelectedItemProperty", label: "selectedItemProperty", 
	params: [{key: "property", type: "string", input:{className:  "stringSelect", type: "data", targetProperty: "data"}}],
	returnType: "dataProperty", description: ""}
    ],
    setters: [
      {name: "load", label: "load", params: [{key: "items", type: "object"}], description: "" },
      {name: "clear", label: "clear", params: [], description: "" },
      {name: "insert", label: "insert", params: [{key: "item", type: "object"} ], description: "" },//引数はスキーマから
      {name: "remove", label: "delete", params: [ {key: "item", type: "object"}], description: "" },//deleteは予約語なので
      {name: "update", label: "update", params: [{key: "item"}], description: "" }//引数はスキーマから
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
    propertyList: ["tagName", "id", "label", {name: "width", input: "number", type: "int"},
		   {name: "field", input: "selectbox", type: "dataproperty", target: "_data"},// "field",//elementの中でdataプロパティに
		   {name: "_data", input: "hidden", type: "data", ref: true, refProp: "id"}
		  ],
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
    propertyList: ["tagName", "id", 
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   {name: "data", input: "selectbox", type: "data", ref: true, refProp: "id"},
		   {name: "label", input: "selectbox", type: "dataproperty", target: "data"}
		  ],
    eventList: ["onDisplay", "onChange"],
    defaultProperties: { tagName: "selectbox"},
    getters: [
      {	name: "getSelectItemProperty", label: "getSelectItemProperty", 
	params: [{key: "property", type: "string", input:{className:  "stringSelect", type: "data", targetProperty: "data"}}],
	returnType: "dataProperty", description: ""},
      {	name: "getSelectItem", label: "getSelectItem",  params: [], returnType: "object", description: "" }
    ],
    setters: [
      {	name: "newItem", label: "newItem", params: [{key: "item", type: "object"}], description: ""},
      { name: "clear", label: "clear",params: [], description: "" },
      {	name: "load", label: "load", params: [{key: "items", type: "objects"}], description: ""}
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
    container: "layout",
    propertyList: ["tagName", "id",
		   {name: "height", input: "number", type: "int"},
		   {name: "width", input: "number", type: "int"},
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   "_isDisplay"],
    eventList: ["onDisplay"],
    defaultProperties: { tagName: "panel", width: "300px", height: "300px"},
    getters: [
      { name: "self", label: "self", params: [], returnType: "element"}
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
    propertyList: ["tagName", "id", "content", 
		   {name: "top", input: "number", type: "int"},
		   {name: "left", input: "number", type: "int"},
		   {name: "width", input: "number", type: "int"},
		   {name: "height", input: "number", type: "int"}
		  ],
    eventList: ["onDisplay"],
    defaultProperties: { tagName: "frame", width: "100px", height: "100px"},
    getters: [
      {	name: "getSelectPanel", label: "getSelectPanel", params: [], returnType: "string", description: "現在選択されているpanelのidを返す"}
    ],
    setters: [
      {	name: "selectPanel", label: "selectPanel", params: [{key: "panel", type: "element", input: { className: "element", type: "child"}}], description: "idのpanelを選択する"}
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
      {	name: "show", label: "show", params: [], description: "idのpanelを選択する"}
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
    propertyList: ["tagName", "id", "tablename", "type", "dbName", "dbDriver",  "_unEdit"],
    eventList: ["onChange", "onInsert", "onDelete", "onUpdate"],
    defaultProperties: { tagName: "database", type: "server",
			dbName: "jdbc:derby:work/sqlite/appName",
			dbDriver: "org.sqlite.JDBC"
		       },
    getters: [
      { name: "selectById", label: "selectById", 
	params: [
	  {key: "idProperty", type: "string", input: {className: "stringSelect", type: "data", targetProperty: "id"}}, 
	  {key: "idValue", type: "any"}], returnType: "object"},
      { name: "selectByIdProperty", label: "selectProperty", 
	params: [
	  {key: "idProperty", type: "string", input: {className: "stringSelect", type: "data", targetProperty: "id"}}, 
	  {key: "idValue", type: "any"}, 
	  {key: "property", type: "string", input: {className: "stringSelect", type: "data", targetProperty: "id"}},
	  {key: "property", type: "string"}
	], 
	returnType: "object"},
      { name: "selectByCondition", label: "selectByCondition", params: [{key: "condition", type: "condition", input:{className: "paramCondition"}}], returnType: "objects"},
      { name: "selectByConditionFirst", label: "selectByConditionFirst", params: [{key: "condition", type: "condition", input:{className: "paramCondition"}}], returnType: "object"},
      { name: "select", label: "selectAll", params: [], returnType: "objects"}
    ],
    setters: [
//      ajweb.model.Funcのなかで定義
//      { name: "insert", label: "insert",params: [{key: "id", type: "int"}], returnType: "object"}, 
//      { name: "update", label: "update", params: [ {key: "item", type: ""}]},
      { name: "delete", label: "delete", params: [
	  {key: "item", type: ""}]}
    ]
  },
  {
    name: "users",
    label: "users database", label_ja: "ユーザデータベース",
    modelType: "database",
    modelClass: "Database",
    elementClass: "Database",
    acceptModelType: ["property"],
    toolboxType: "database",
    propertyList: ["tagName", "id", "tablename", "type", "dbName", "dbDriver", "_unEdit"],
    eventList: ["onChange", "onInsert", "onDelete", "onUpdate"],
    defaultProperties: { tagName: "database", type: "server",
			 id: "users",
			 tablename: "users", 
			 dbName: "jdbc:derby:work/appName",
			 dbDriver: "org.apache.derby.jdbc.EmbeddedDriver",
			 _unEdit: ["id", "tablename"]
		       }
  },
  {
    name: "property",
    label : "property", label_ja: "プロパティ",
    modelType: "property",
    modelClass: "property",
    elementClass: "property",
    acceptModelType: [],
    toolboxType: "database",
    propertyList: ["name", "type","multiplicity",{name: "ref", type: "element", ref: true, refProp: "id"}, "unique"],
    defaultProperties: {name:"propertyName", type: "int", unique: "false"}
  },
  {
    name: "init",
    modelType: "init",
    modelClass: "Init",
    elementClass: "Init",
    acceptModelType: [],
    propertyList: [],
    defaultProperties: {}
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
    propertyList: ["tagName", "id", {name: "database", type: "element", ref: true, refProp: "id"}],
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
    propertyList: ["tagName", "id", {name: "database", type: "element", ref: true, refProp: "id"}],
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
    propertyList: ["tagName", "id", {name: "database", type: "element", ref: true, refProp: "id"}],
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
    propertyList: ["tagName", "id", 
		   {name: "element", type: "element", ref: true, refProp: "id"},
		   "func"],
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
    elementClass: "Int",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    getters: [
      {name: "direct", label: "direct", params:[{key: "value", type: "int", input:{className: "int"}}]}
    ],
    setters: []
  },
  {
    name: "string",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "String",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    getters: [
      {name: "direct", label: "direct", params:[{key: "value", type: "string", input:{className: "string"}}]},
      {name: "concat", label: "concat", func: "concat", property: "", params: [{key: "first", type: "string"},{key: "second", type: "string"}], returnType: "string" }
    ],
    setters: []
  },
  {
    name: "date",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "Date",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    getters: [
      {name: "direct", label: "direct", params:[{key: "base", type: "date", input:{className: "date"}}]},
      {name: "now", label: "now", params:[]}
    ],
    setters: []
  },
  {
    name: "time",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "Time",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    getters: [
      {name: "direct", label: "direct", params:[{key: "base", type: "time", input:{className: "time"}}]},
      {name: "now", label: "now", params:[]}
    ],
    setters: []
  },
  {
    name: "datetime",
    modelType: "value",
    modelClass: "Visible",
    elementClass: "Datetime",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {},
    getters: [
      {name: "direct", label: "direct", params:[{key: "base", type: "datetime", input:{className: "datetime"}}]},
      {name: "now", label: "now", params:[]}
    ],
    setters: []
  },
  {
    name: "stringSelect",
    modelType: "value",
    modelClass: "StringSelect",
    elementClass: "StringSelect",
    acceptModelType: [],
    propertyList: ["type", "target", "_isSetter"],
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
    propertyList: [
      {name: "element", type: "element", ref: true, refProp: "id"}, 
      "func", "type", "elemType", "database"],
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
  },
  {
    name: "targetItem",
    modelType: "",
    elementType: "",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    getters : [
      {name: "self", label: "self", params: []},
      {name: "property", label: "property", params: [{key: "name", type: "", input:{className:  "stringSelect", type: "data", targetProperty: "database"}}]}
    ],
    defaultProperties: {}
  },
  {
    name: "receivedItem",
    modelType: "",
    elementType: "",
    acceptModelType: [],
    propertyList: ["receivedDatabase"],
    eventList: [],
    getters : [
      {name: "self", label: "self", params: []},
      {name: "property", label: "property", params: [{key: "name", type: "", input:{className:  "stringSelect", type: "data", targetProperty: "database"}}]}
    ],
    defaultProperties: {}
  },
/*  {todo 拡張可能なjavaScriptの関数を条件として
    name: "valueIsTrue",
    modelType: "predicate",
    modelClass: "Model",
    elementClass: "Predicate",
    acceptModelType: [],
    propertyList: [],
    eventList: [],
    defaultProperties: {}
  },*/
//Functionしかないもの
  {
    name: "user state",
    getters: [
      { name: "user_data", label: "user_data", 
	params: [
	  {key: "user_id", type: "string"}, 
	  {key: "password", type: "password"}
	], returnType: "users"}
    ],
    setters: []
  }
];
//});


