dojo.require("ajweb.base");
dojo.require("ajweb.xml");
dojo.require("ajweb.editor.modelList");
dojo.require("ajweb.editor.funcList");
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
    children: [{name:'label'},{name:'button'},{name:'textbox'},{name:'selectbox'},{name:'table'},{name:'th'},{name:'panel'},{name:'frame'}]
  },
  {
    name: "DB",
    children: [{name: "database"},{name: "property"}]
  },
  {
  name: "Event",
    children: [{name: "condition"}]
  },
  {
    name: "Function",
    children: [{name: "login"},{name: "insert"},{name: "update"},{name: "delete"},{name: "call"},{name: "branch"}/*,{name: "then"},{name: "else"},{name: "param"}*/]
  }/*,
  {
    name: "Value",
    children: [{name: "int"},{name: "string"},{name: "date"},{name: "datetime"},{name: "getValue"},{name: "select"}]
  },
  {
    name: "Condition",
    children: [{name: "condition"},{name: "and"},{name: "or"},{name: "not"},{name: "eq"},{name: "lt"},{name: "gt"}]
  }*/
];

ajweb.editor.dataTypes =[
  {id: "int", name: "int" }, {id: "string", name: "string" }, {id: "password", name: "password" },{id: "date", name: "date" },{id: "datetime", name: "datetime"}
];
/**
 * ajwebでサポートされる型を保持するdojoストア
 */
ajweb.editor.dataTypeStore = new dojo.data.ItemFileReadStore(
	{
	  data:{
	    identifier: "name",
	    label: "name",
	    items: ajweb.editor.dataTypes
	  }
	});
/**
 * 条件式の演算子をアルファベットから記号表記に変換
 */
ajweb.editor.conditionToOperator = function(name){
  if(name == "eq")
    return "=";
  else if(name == "gt")
  return ">";
  else if(name == "lt")
  return "<";
  else if(name == "and")
  return "AND";
  else if(name == "or")
  return "OR";
  else if(name == "not")
  return "NOT";

  return "";
};
/**
 * 条件式のdojoストア
 */

ajweb.editor.conditionOperatorStore = new dojo.data.ItemFileReadStore(
	{
	  data:{
	    identifier: "name",
	    label: "name",
	    items: [
	      {name: "true"},
	      { name: "and" }, { name: "or" }, { name: "not" },
	      { name: "eq" },{name: "gt"} ,{name: "lt"}, {name: "success"}
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

ajweb.editor.getFuncStore = function(modelName, store){
  if(!store)
    store = new dojo.data.ItemFileWriteStore({ data: { identifier: "name", label : "name", items: []}});
  else {
    store.fetch({
		  onItem: function(item){
		    store.deleteItem(item);
		  }});
    store.save();
  }
  var list =  ajweb.editor.FUNCLIST;
  var items = [];
  for(var i = 0; i < list.length; i++){
    if(list[i].name == modelName){
      for(var j = 0; j < list[i].setters.length; j++){
	store.newItem(list[i].setters[j]);
      }
    }
  }
  return store;
};
/**
 * FUNCLISTからmodelNameのfuncのリストを検索しdojo storeとして返す。
 * returnTypeは、funcのreturnTypeによる絞り込み
 */
ajweb.editor.getGetterStore = function(modelName, store, returnType){
  if(!store)
    store = new dojo.data.ItemFileWriteStore({ data: { identifier: "name", label : "name", items: []}});
  else {
    store.fetch({onItem: function(item){
		   store.deleteItem(item);
		 }});
    store.save();
  }
  var list =  ajweb.editor.FUNCLIST;
  var items = [];
  if(!modelName) return store;
  if(modelName.match("([0-9a-z]+):(targetItem|receivedItem)")){
    store.newItem({name: "self"});
    store.newItem({name: "property"});
  }
  else{
    for(var i = 0; i < list.length; i++){
      if(list[i].name == modelName){
	for(var j = 0; j < list[i].getters.length; j++){
	  if(!returnType || list[i].getters[j].returnType == returnType){
	    store.newItem(list[i].getters[j]);
	  }

	}
      }
    }
  }
  return store;
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
ajweb.editor.getNodeAttributes = function(childNode){
  var attributes = childNode.attributes;
  var attrs = {};
  for(var i = 0; i < attributes.length; i++){
    attrs[attributes[i].name] = attributes[i].value;
  }
  for(var j = 0; j < childNode.childNodes.length; j++){
    if(childNode.childNodes[j] instanceof Text){
      attrs._character = childNode.childNodes[j].data;
    }
  }

  return attrs;
};

ajweb.editor.FONT_SIZE = 7.8;
ajweb.editor.REMOVE_ICON_SIZE = 30;
ajweb.editor.ADD_EVENT_BUTTON_LEFT = 40;
ajweb.editor.ADD_EVENT_BUTTON_LEFT_NOELEMENT = 110;
ajweb.editor.CONDITION_DIALOG_HEIGHT = 250;
ajweb.editor.CONDITION_DIALOG_WIDTH = 350;