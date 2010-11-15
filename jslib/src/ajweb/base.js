/**
 * @fileOverview ajwebの全体的な記述について
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.base");

if(!ajweb){

/** @namespace */
  ajweb =  {
    /** バージョン情報*/
  Version: "1.0.0",
    /** ブラウザ情報*/
  Browser: (function () {
	      var ua = navigator.userAgent;
	      var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
		return {
		  IE:             !!window.attachEvent && !isOpera,
		  Opera:          isOpera,
		  WebKit:         ua.indexOf('AppleWebKit/') > -1,
		  Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
		  MobileSafari:   /Apple.*Mobile/.test(ua)
		  };
		}
	      )(),
  /** ajweb.widgetパッケージ*/
  widget: {}
  };
}

ajweb.databases = [];

ajweb.server_databases = [];
ajweb.elements = [];
ajweb.addElement = function(element){
  for(var i = 0; i < ajweb.elements; i++){
    if(ajweb.elements[i] == element.id)
      throw new Error("this element id is already registerd!");
  }
  ajweb.elements.push(element);
};
ajweb.byId = function(id){
  for(var i = 0; i < ajweb.elements.length; i++){
    if(ajweb.elements[i].id == id)
      return ajweb.elements[i];
    }
  return null;
};
/**
 * javaScriptの値をJSON形式の文字列に変換
 * @methodOf ajweb
 * @param {object} params JSON形式に直すjavaScriptの値
 * @returns {String} JSON形式の文字列
 * */
ajweb.toJSON = function(params, properties){
//  if(!properties){
    return JSON.stringify(params);
//  }
/*  else {

    var _params = {};
    for(var i = 0; i < properties.length; i++){
      _params[properties[i]] = params[properties[i]];
    }
    var str = JSON.stringify(_params);
 alert(str);
    return str;
  }*/
};

/**
 * ある配列にある値が入っているかどうか
 * @methodOf ajweb
 * @param {Array} array 配列
 * @param {String} value 値
 * @returns {Boolean}
 * */
ajweb.contains = function(array, value){
  for(var i = 0; i < array.length; i++){
    if(array[i] == value)
      return true;
  }
  return false;
};

ajweb.log = {};
ajweb.log.level = "info";
ajweb.log.getLevelValue = function(st){
  if(st == "trace" || st == "all"){
    return 0;
  }
  else if(st == "debug"){
    return 1;
  }
  else if(st == "info"){
    return 2;
  }
  else if(st == "warn"){
    return 3;
  }
  else if(st == "error"){
    return 4;
  }
  else if(st == "fatal"){
    return 5;
  }
  new Error("unknown log level");
  return false;
};

ajweb.log.trace = function(log){
  if(ajweb.log.getLevelValue(ajweb.log.level) <= ajweb.log.getLevelValue("trace"))
    console.log(log);
};
ajweb.log.debug = function(log){
  if(ajweb.log.getLevelValue(ajweb.log.level) <= ajweb.log.getLevelValue("debug"))
    console.debug(log);
};
ajweb.log.info = function(log){
  if(ajweb.log.getLevelValue(ajweb.log.level) <= ajweb.log.getLevelValue("info"))
    console.info(log);
};
ajweb.log.warn = function(log){
  if(ajweb.log.getLevelValue(ajweb.log.level) <= ajweb.log.getLevelValue("warn"))
    console.warn(log);
};
ajweb.log.error = function(log){
  if(ajweb.log.getLevelValue(ajweb.log.level) <= ajweb.log.getLevelValue("error"))
    console.error(log);
};
ajweb.log.fatal = function(log){
  if(ajweb.log.getLevelValue(ajweb.log.level) <= ajweb.log.getLevelValue("fatal"))
    console.fatal(log);
};


ajweb.addEvent = function(target, type, condition, callback){
 return  dojo.connect(target, type, null, function(receivedItem, database){
    var con = condition;
    if(!condition instanceof ajweb.data.AbstractCondition)
      con = condition.evaluate(receivedItem, database);
    if(con){
      callback(receivedItem, database);
      }
    });
};