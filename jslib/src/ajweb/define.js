/**
 * @fileOverview ajwebの全体的な記述について
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */


dojo.provide("ajweb.define");

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

