dojo.provide("ajweb.editor.extension.DateTextbox");
dojo.addOnLoad(function(){
ajweb.editor.MODELLIST.push(
  {
    name:'dateTextbox',
    label:'dateTextbox', label_ja:'æ—¥ä»˜ãƒ†ã‚­ã‚¹ãƒˆãƒœãƒƒã‚¯ã‚¹',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Textbox",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "width", "top", "left", "content"],
    eventList: ["onDisplay", "onFocus", "onBlur"],
    defaultProperties: {tagName: "textbox", width: "100px", height: "100px"},
    getters: [
      {	id: "getValue", name: "value", params: [], returnType: "string", description: "“ü—Í‚³‚ê‚Ä‚¢‚é’l‚ðŽæ“¾" }
    ],
    setters: []
  });

});