/*jslint browser:true */
/**
 * @fileOverview AJWeb namespace
 * 
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */

/**
 * @class ajwebの名前空間およびプロパティを保持するstaticクラス
 *
 *
 */
var ajweb = {
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
	})()
};


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

ajweb.contains = function(array, value){
  for(var i = 0; i < array.length; i++){
    if(array[i] == value)
      return true;
  }
  return false;
};