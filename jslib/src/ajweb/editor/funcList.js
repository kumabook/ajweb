dojo.provide("ajweb.editor.funcList");
ajweb.editor.FUNCLIST = [
  {
    name: "int",
    getters: [
      {name: "direct", params:[{key: "value", type: "int"}]}
    ],
    setters: []
  },
  {
    name: "string",
    getters: [
      {name: "direct", params:[{key: "value", type: "string"}]},
      {name: "concat",	params: [{key: "first", type: "string"},{key: "second", type: "string"}], returnType: "string" }
    ],
    setters: []
  },
  {
    name: "date",
    getters: [
      {name: "direct", params:[{key: "base", type: "date"}]},
      {name: "now", params:[]}
    ],
    setters: []
  },
  {
    name: "datetime",
    getters: [
      {name: "direct", params:[{key: "base", type: "datetime"}]},
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
  {
    name: "label",
    getters: [
      {	name: "label",params: [{key: "value", type: "string"}]}
    ],
    setters: []
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
      {name: "label",params: [{key: "value", type: "string"}]}
    ],
    setters: []
  },
  {
    name: "selectbox",
    getters: [
      {	name: "value", params: [{key: "value", type: "string"}], returnType: "string", description: ""},
      {	name: "selectItem", params: [{key: "property", type: "string"}], returnType: "object", description: "" }
    ],
    setters: [
      {	name: "newItem", params: [{key: "item", type: "object"}], description: ""}
    ]
  },
  {
    name: "panel",
    getters: [
      { name: "label",params: [ {key: "value", type: "string"}]}
    ],
    setters: []
  },
  {
    name: "frame",
    getters: [
      {	name: "selectPanel", params: [], returnType: "string", description: "現在選択されているpanelのidを返す"}
    ],
    setters: [
      {	name: "selectPanel", params: [{key: "panel", type: "element"}], description: "idのpanelを選択する"}
    ]
  },
  {
    name: "database",
    getters: [
      { name: "selectById",params: [{key: "id", type: "int"}], returnType: "object"},
      { name: "select", params: [{key: "condition", type: "condition", returnType: "object"}]}
    ],
    setters: [
      { name: "insert",params: [{key: "id", type: "int"}], returnType: "object"},
      { name: "update", params: [{key: "condition", type: "condition", returnType: "object"}]},
      { name: "delete", params: [{key: "condition", type: "condition", returnType: "object"}]}
    ]
  }

];
