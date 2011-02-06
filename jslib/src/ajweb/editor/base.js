dojo.provide("ajweb.editor.base");
dojo.require("ajweb.base");
dojo.require("ajweb.xml");
dojo.require("dojo.data.ItemFileWriteStore");

ajweb.editor.mousePosition = { left: 0, width: 0 };


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
    store = ajweb.editor.getEmptyStore("name", "label");
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
	//ここにフィルターを必要ならば追加 いまのところいらない
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
    store = ajweb.editor.getEmptyStore("name", "label");
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
    store.newItem({name: "self", label: "self"});
    store.newItem({name: "property", label: "property"});
  }
  else{
    for(var i = 0; i < list.length; i++){
      if(list[i].name == modelName){
	for(var j = 0; j < list[i].getters.length; j++){
	  if(!returnType || list[i].getters[j].returnType == returnType 
	     || !list[i].getters[j].returnType){
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

ajweb.editor.getQuery = function(){
  var url = new String(window.location);
  var urlArray = url.split("?");
  var query_str = !!urlArray[1] ? urlArray[1] : "";
  return dojo.queryToObject(query_str);  
};


dojo.addOnLoad(function(){//resourcesなどを読み込んだ後に設定する．
//		 ajweb.locale = ajweb.locale ? ajweb.locale : "en";

		 dojo.connect(document, "mouseup", function(e){
				var container = dojo.byId("centerTc");
				ajweb.editor.mousePosition.left = (e.clientX - ajweb.editor.getX(container)) + "px";
				ajweb.editor.mousePosition.top = (e.clientY - ajweb.editor.getY(container)) + "px";
				ajweb.editor.mousePosition.x = e.clientX;
				ajweb.editor.mousePosition.y = e.clientY;
			      });


	       });

ajweb.editor.FONT_SIZE = 10.8;
ajweb.editor.REMOVE_ICON_SIZE = 30;
ajweb.editor.ADD_EVENT_BUTTON_LEFT = 40;
ajweb.editor.ADD_EVENT_BUTTON_LEFT_NOELEMENT = 110;

ajweb.editor.CONDITION_DIALOG_HEIGHT = 200;
ajweb.editor.CONDITION_DIALOG_WIDTH = 300;

ajweb.editor.PARAM_WIDTH = 30;

ajweb.editor.PARAM_CONTAINER_TOP = 80;
ajweb.editor.PARAM_CONTAINER_LEFT = 10;


ajweb.editor.DATABASE_WIDTH = 280;
ajweb.editor.DATABASE_INIT_HEIGHT = 100;
ajweb.editor.DATABASE_PROP_HEIGHT = 30;
ajweb.editor.DATABASE_PROPNAME_WIDTH  = 110;

ajweb.editor.DIALOG_WIDTH = 420;
ajweb.editor.DIALOG_HEIGHT = 300;
ajweb.editor.DIALOG_TOP = 100;
ajweb.editor.DIALOG_LEFT = 50;

ajweb.editor.DROP_AREA_WIDTH = 120;
ajweb.editor.DROP_AREA_HEIGHT = 50;
ajweb.editor.CONDITION_DROP_AREA_TOP = 50;
ajweb.editor.CONDITION_DROP_AREA_LEFT = 25;
ajweb.editor.FUNCTION_DROP_AREA_TOP = 50;
ajweb.editor.FUNCTION_DROP_AREA_LEFT = 200;

ajweb.editor.PARAM_NAME_TOP = 7;
ajweb.editor.PARAM_NAME_WIDTH = 110;
ajweb.editor.PARAM_HEIGHT = 35;

ajweb.editor.VALUE_WIDTH = 200;
ajweb.editor.VALUE_HEIGHT = 30;

ajweb.editor.METHOD_SEPARATOR = ".";
ajweb.editor.PARAM_SEPARATOR = ": ";

ajweb.editor.INIT_TOP = 30;
ajweb.editor.INIT_LEFT = 10;

ajweb.editor.CONDITION_TOP = 70;
ajweb.editor.CONDITION_LEFT = 70;

ajweb.editor.CONDITION_OPERATOR_TOP = 35;
ajweb.editor.CONDITION_OPERATOR_LEFT = 95;


ajweb.editor.initResource = function(){


ajweb.resources = dojo.i18n.getLocalization("ajweb.editor", "resources");//, ajweb.locale);//, "ja");

  ajweb.editor.toolboxItems = (function(){
				 var label = ajweb.locale == "" || ajweb.locale == "en" ? "label" : "label_"+ajweb.locale;
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
};