dojo.provide("ajweb.editor.funcList");
ajweb.editor.FUNCLIST = [
  {
    name: "int",
    getters: [
      {name: "direct", params:[{key: "value", type: "int", input:{className: "int"}}]}
    ],
    setters: []
  },
  {
    name: "string",
    getters: [
      {name: "direct", params:[{key: "value", type: "string", input:{className: "int"}}]},
      {name: "concat",	params: [{key: "first", type: "string"},{key: "second", type: "string"}], returnType: "string" }
    ],
    setters: []
  },
  {
    name: "date",
    getters: [
      {name: "direct", params:[{key: "base", type: "date", input:{className: "date"}}]},
      {name: "now", params:[]}
    ],
    setters: []
  },
  {
    name: "datetime",
    getters: [
      {name: "direct", params:[{key: "base", type: "datetime", input:{className: "datetime"}}]},
      {name: "now", params:[]}
    ],
    setters: []
  },
  {
    name: "password",
    getters: [
    ],
    setters: []
  },
/*  {
    name: "targetItem",
    properties: [{name: "property", type: "select"}],
    getters: [
      {name: "self", params:[], returnType: "object"},
      {name: "property", params:[{key: "propertyName", type: "property", input: "selectbox"}], returnType: "database"}
    ],
    setters: []
  },
  {
    name: "receivedItem",
    properties: [{name: "property", type: "select"}],
    getters: [
      {name: "self", params:[], returnType: "object"},
      {name: "property", params:[{key: "propertyName", type: "property", input: "selectbox"}], returnType: "database"}
    ],
    setters: []
  },*/
  {
    name: "label",
    getters: [
      {	name: "content", params: [{key: "value", type: "string"}]}
    ],
    setters: [{name: "setContent", params: [{key: "content", type: "string"}], description: "表示されている内容を変更" }]
  },
  {
    name: "button",
    getters: [
      {name: "label",params: [{key: "value", type: "string"}]}
    ],
    setters: []
  },
  {
    name: "textbox",
    getters: [
      {	name: "value",params: [], returnType: "string", description: "テキストボックスに入力されている値を取得" }
    ],
    setters: []
  },
  {
    name: "table",
    getters: [
      {name: "label",params: [ {key: "value", type: "string"}] }
    ],
    setters: [
      {name: "load",params: [{key: "item", type: "object"}], description: "" },
      {name: "clear",params: [], description: "" },
      {name: "insert",params: [ {key: "item", type: "object"}], description: "" }
    ]
  },
  {
    name: "th",
    getters: [
//      {name: "label",params: [{key: "value", type: "string"}]}
    ],
    setters: []
  },
  {
    name: "selectbox",
    getters: [
      {	name: "selectItemPropety", params: [{key: "property", type: "string", input:{className:  "StringSelect", type: "data", targetProperty: "data"}}], returnType: "dataProperty", description: ""},
      {	name: "selectItem", params: [], returnType: "object", description: "" }
    ],
    setters: [
      {	name: "newItem", params: [{key: "item", type: "object"}], description: ""},
      {name: "clear",params: [], description: "" },
      {	name: "load", params: [{key: "datum", type: "objects"}], description: ""}
    ]
  },
  {
    name: "panel",
    getters: [
      { name: "self", params: [], returnType: "element"}
    ],
    setters: []
  },
  {
    name: "frame",
    getters: [
      {	name: "selectPanel", params: [], returnType: "string", description: "現在選択されているpanelのidを返す"}
    ],
    setters: [
      {	name: "selectPanel", params: [{key: "panel", type: "element", input: { className: "element", type: "child"}}], description: "idのpanelを選択する"}
    ]
  },
  {
    name: "database",
    getters: [
      { name: "selectById",params: [{key: "id", type: "int"}], returnType: "object"},
      { name: "selectByCondition", params: [{key: "condition", type: "condition", input:{className: "paramCondition"}}], returnType: "objects"},
      { name: "select", params: [], returnType: "objects"}
    ],
    setters: [
      { name: "insert",params: [{key: "id", type: "int"}], returnType: "object"},
      { name: "update", params: [{key: "condition", type: "condition", returnType: "object"}]},
      { name: "delete", params: [{key: "condition", type: "condition", returnType: "object"}]}
    ]
  }

];
