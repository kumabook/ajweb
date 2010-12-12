dojo.provide("ajweb.editor.funcList");
ajweb.editor.FUNCLIST = [
  {
    name: "string",
    getters: [
      {
	name: "concat",
	params: [
	  {key: "first", type: "string"},
	  {key: "second", type: "string"}
	]
      }
    ],
    setters: []
  },
  {
    name: "button",
    getters: [
      {
	name: "label",
	params: [
	  {key: "value", type: "string"}
	]
      }
    ],
    setters: []
  }

];
