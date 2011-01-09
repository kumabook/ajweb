dojo.provide("ajweb.editor.base");
dojo.require("ajweb.base");
dojo.require("ajweb.xml");
dojo.require("dojo.data.ItemFileReadStore");

//dojo.require("ajweb.editor.funcList");
ajweb.locale = ajweb.locale ? ajweb.locale : "en";

dojo.requireLocalization("ajweb.editor", "resources");
ajweb.resources = dojo.i18n.getLocalization("ajweb.editor", "resources", ajweb.locale);
dojo.require("ajweb.editor.modelList");

ajweb.editor.mousePosition = { left: 0, width: 0 };


ajweb.editor.toolboxItems = (function(){
			       var label = ajweb.locale == "en" ? "label" : "label"+ajweb.locale;
			       var toolboxItemWidget = [];
			       var toolboxItemDatabase = [];
			       var toolboxItemEvent = [];
			       var toolboxItemAction = [];
			       var mlist = ajweb.editor.MODELLIST;
			       var i = 0;
			       for(i = 0; i < mlist.length; i++){
				 if(mlist[i].toolboxType && mlist[i].toolboxType == "widget")
				   toolboxItemWidget.push({id: mlist[i].name, name: mlist[i][label] ? mlist[i][label] : mlist[i].name});
				 if(mlist[i].toolboxType && mlist[i].toolboxType == "database")
				   toolboxItemDatabase.push({id: mlist[i].name, name: mlist[i][label] ? mlist[i][label] : mlist[i].name});
				 if(mlist[i].toolboxType && mlist[i].toolboxType == "event")
				   toolboxItemEvent.push({id: mlist[i].name, name: mlist[i][label] ? mlist[i][label] : mlist[i].name});
				 if(mlist[i].toolboxType && mlist[i].toolboxType == "action")
				   toolboxItemAction.push({id: mlist[i].name, name: mlist[i][label] ? mlist[i][label] : mlist[i].name});
			       }
			       toolboxItemEvent.push({id: "action", name: "Action",children: toolboxItemAction});
			       return [
				 {
				   id:"Widgets", name:"Widgets",
				   children: toolboxItemWidget
				 },
				 {
				   id: "DB",  name: "DB",
				   children: toolboxItemDatabase
				 },
				 {
				   id: "Event", name: "Event",
				   children: toolboxItemEvent
				 }
			       ];
			     })();

ajweb.editor.getStore =  function(id, label, items){
    return new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    identifier: id ? id : "name",
	    label : label ? label : "name",
	    items: items ? items : []
	  }
	}
      );
};
ajweb.editor.getEmptyStore =  function(id, label, items){
  return ajweb.editor.getStore(id, label, []);
};

ajweb.remove = function(item, array){
  for(var i = 0; i < array.length; i++){
    if(array[i] == item)
      array.splice(i,1);
    }
};

/**
 * ajwebでサポートされる型を保持するdojoストア
 */
ajweb.editor.dataTypeStore = ajweb.editor.getStore("id", "name", ajweb.resources.dataTypes);

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
ajweb.editor.conditionOperatorStore = ajweb.editor.getStore("id", "name", ajweb.resources.conditionOperators);

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
 *
 */
ajweb.editor.getModelName = function(label){
  var model = ajweb.editor.getModel(label, "name");
  if(model){
    return model.id;
  }
  else
    return null;
},

ajweb.editor.getModel = function(propValue, propName){
  return ajweb.editor._getModel(propValue, propName, ajweb.editor.toolboxItems);
},

ajweb.editor._getModel = function(propValue, propName, array){
  for(var i = 0; i < array.length; i++){
    var model;
    if(array[i].children)
      model = ajweb.editor._getModel(propValue, propName, array[i].children);
    else{
      if(array[i][propName] == propValue)
	return array[i];
    }
    if(model)
      return model;
  }
  return null;
},

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
    store = ajweb.editor.getEmptyStore();
  else {
    store.fetch({
		  onItem: function(item){
		    if(item)
		      store.deleteItem(item);
		  }});
    store.save();
  }

  var list =  ajweb.editor.MODELLIST;
  var items = [];
  for(var i = 0; i < list.length; i++){
    if(list[i].name == modelName){
      for(var j = 0; j < list[i].setters.length; j++){
	//ここにフィルターを必要ならば追加
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
    store = ajweb.editor.getEmptyStore();
  else {
    store.fetch({onItem: function(item){
		   if(item)
		     store.deleteItem(item);
		 }});
    store.save();
  }
  var list =  ajweb.editor.MODELLIST;
  var items = [];
  if(!modelName) return store;
  if(modelName.match("([0-9a-z]+):(targetItem|receivedItem)")){
    store.newItem({id: "self", name: "self"});
    store.newItem({id: "property", name: "property"});
  }
  else{
    for(var i = 0; i < list.length; i++){
      if(list[i].id == modelName){
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
    if(childNode.childNodes[j].data != undefined){// || childNode.childNodes[j] instanceof CharacterData){
      attrs._character = childNode.childNodes[j].data;
    }
  }
  return attrs;
};

ajweb.editor.FONT_SIZE = 7.8;
ajweb.editor.REMOVE_ICON_SIZE = 30;
ajweb.editor.ADD_EVENT_BUTTON_LEFT = 40;
ajweb.editor.ADD_EVENT_BUTTON_LEFT_NOELEMENT = 110;
ajweb.editor.CONDITION_DIALOG_HEIGHT = 200;
ajweb.editor.CONDITION_DIALOG_WIDTH = 300;
