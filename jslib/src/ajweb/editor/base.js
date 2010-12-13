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
    children: [{name:'label'},{name:'button'},{name:'textbox'},{name:'table'},{name:'th'},{name:'panel'},{name:'frame'}]
  },
  {
    name: "DB",
    children: [{name: "database"},{name: "property"}]
  },
  {
    name: "Function",
    children: [{name: "insert"},{name: "update"},{name: "delete"},{name: "setValue"},{name: "branch"}/*,{name: "then"},{name: "else"},{name: "param"}*/]
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

/**
 * ajwebでサポートされる型を保持するdojoストア
 */
ajweb.editor.dataTypeStore = new dojo.data.ItemFileReadStore(
	{
	  data:{
	    identifier: "name",
	    label: "name",
	    items: [
	      { name: "int" }, { name: "string" }, { name: "password" },{ name: "date" },{name: "datetime"}
	    ]
	  }
	});
/**
 * valueタイプを保持するdojoストア
 */
ajweb.editor.valueTypeStore = new dojo.data.ItemFileWriteStore(
	{
	  data:{
	    identifier: "id",
	    label: "name",
	    items: [
	      {id: "int", name: "int"},
	      {id: "string", name: "string" }, { id: "password", name: "password" },{ id: "date" ,name: "date" },{id: "datetime", name: "datetime"},
	      {id: "separator1"},
	      {id: "element", name: '<span class="ajwebValueMenuSeparate">element</span>', selected: false}, 
	      {id: "separator2"},
	      {id: "database",name: '<span class="ajwebValueMenuSeparate">database</span>', selected: false}
	    ]
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
	      { name: "eq" },{name: "gt"} ,{name: "lt"}
	    ]
	  }
	});

ajweb.editor.databaseModelStore = new dojo.data.ItemFileReadStore(
	{
	  data:{
	    identifier: "name",
	    label: "name",
	    items: []
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
ajweb.editor.attributesToHash = function(attributes){
  var attrs = {};
  for(var i = 0; i < attributes.length; i++){
    attrs[attributes[i].name] = attributes[i].value;
  }
  return attrs;
};
