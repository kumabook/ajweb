dojo.provide("ajweb.editor.extension.TimeTextbox");
dojo.addOnLoad(function(){
ajweb.editor.MODELLIST.push(
  {
    name:'timeTextbox',
    label:'timeTextbox', label_ja:'時刻テキストボックス',
    modelType: "widget",
    modelClass: "Widget",
    elementClass: "Textbox",
    acceptModelType: [],
    toolboxType: "widget",
    propertyList: ["tagName", "id", "width", "top", "left", "content"],
    eventList: ["onDisplay", "onFocus", "onBlur"],
    defaultProperties: {tagName: "textbox", width: "100px", height: "100px"},
    getters: [
      {	id: "getValue", name: "value", params: [], returnType: "string", description: "入力されている値を取得" }
    ],
    setters: []
  });

});