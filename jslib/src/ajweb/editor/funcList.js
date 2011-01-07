dojo.provide("ajweb.editor.funcList");
ajweb.editor.FUNCLIST = [

//基本データ型
  {
    id: "int", name: "int",
    getters: [
      {id: "direct", name: "direct", params:[{key: "value", type: "int", input:{className: "int"}}]}
    ],
    setters: []
  },
  {
    id: "string", name: "string",
    getters: [
      {id: "direct", name: "direct", params:[{key: "value", type: "string", input:{className: "string"}}]},
      {id: "concat", name: "concat", func: "concat", property: "", params: [{key: "first", type: "string"},{key: "second", type: "string"}], returnType: "string" }
    ],
    setters: []
  },
  {
    id: "date", name: "date",
    getters: [
      {id: "direct", name: "direct", params:[{key: "base", type: "date", input:{className: "date"}}]},
      {id: "now", name: "now", params:[]}
    ],
    setters: []
  },
  {
    id: "datetime", name: "datetime",
    getters: [
      {id: "direct", name: "direct", params:[{key: "base", type: "datetime", input:{className: "datetime"}}]},
      {id: "now", name: "now", params:[]}
    ],
    setters: []
  },
  {
    id: "password", name: "password",
    getters: [
    ],
    setters: []
  },

//ウィジェット
  {
    id: "label", name: "label",
    getters: [
      {	id: "content", name: "content", func: "get", property: "Content", params: [{key: "value", type: "string"}]}
    ],
    setters: [{id: "setContent", name: "setContent", params: [{key: "content", type: "string"}], description: "表示されている内容を変更" }]
  },
  {
    id: "button", name: "button",
    getters: [
      {id: "label", name: "label",params: [{key: "value", type: "string"}]}
    ],
    setters: []
  },
  {
    id: "textbox", name: "textbox",
    getters: [
      {	id: "value", name: "value", func: "get", property: "Value", params: [], returnType: "string", description: "テキストボックスに入力されている値を取得" }
    ],
    setters: []
  },
  {
    id: "passwordbox", name: "passwordbox",
    getters: [
      {	id: "value", name: "value", func: "get", property: "Value", params: [], returnType: "string", description: "パスワードボックスに入力されている値を取得" }
    ],
    setters: []
  },
  {
    id: "table", name: "table",
    getters: [
//      {name: "label",params: [ {key: "value", type: "string"}] }
    ],
    setters: [
      {id: "load", name: "load",params: [{key: "item", type: "object"}], description: "" },
      {id: "clear", name: "clear",params: [], description: "" },
      {id: "insert", name: "insert",params: [ {key: "item", type: "object"}], description: "" }
    ]
  },
  {
    id: "th", name: "th",
    getters: [
//      {name: "label",params: [{key: "value", type: "string"}]}
    ],
    setters: []
  },
  {
    id: "selectbox", name: "selectbox",
    getters: [
      {	id: "selectItemProperty", name: "selectItemProperty", func: "get", property: "SelectItemProperty", 
	params: [{key: "property", type: "string", input:{className:  "stringSelect", type: "data", targetProperty: "data"}}],
	returnType: "dataProperty", description: ""},
      {	id: "selectItem", name: "selectItem", func: "get", property: "SelectItem", params: [], returnType: "object", description: "" }
    ],
    setters: [
      {	id: "newItem", name: "newItem", params: [{key: "item", type: "object"}], description: ""},
      { id: "clear", name: "clear",params: [], description: "" },
      {	id: "load", name: "load", params: [{key: "datum", type: "objects"}], description: ""}
    ]
  },
  {
    id: "panel", name: "panel",
    getters: [
      { id: "self", name: "self", params: [], returnType: "element"}
    ],
    setters: []
  },
  {
    id: "frame", name: "frame",
    getters: [
      {	id: "selectPanel", name: "selectPanel", func: "get", property: "SelectPanel", params: [], returnType: "string", description: "現在選択されているpanelのidを返す"}
    ],
    setters: [
      {	id: "selectPanel", name: "selectPanel", params: [{key: "panel", type: "element", input: { className: "element", type: "child"}}], description: "idのpanelを選択する"}
    ]
  },
//データベース
  {
    id: "database", name: "database",
    getters: [
      { id: "selectById", name: "selectById", property: "Content", params: [{key: "id", type: "int"}], returnType: "object"},
      { id: "selectByCondition", name: "selectByCondition", params: [{key: "condition", type: "condition", input:{className: "paramCondition"}}], returnType: "objects"},
      { id: "select", name: "select", params: [], returnType: "objects"}
    ],
    setters: [
      { id: "insert", name: "insert",params: [{key: "id", type: "int"}], returnType: "object"},
      { id: "update", name: "update", params: [{key: "condition", type: "condition", returnType: "object"}]},
      { id: "delete", name: "delete", params: [{key: "condition", type: "condition", returnType: "object"}]}
    ]
  }

];
