dojo.require("ajweb.base");
dojo.provide("ajweb.xml");
/**
 * xmlのユーティリティを定義する名前空間
 * @namespace 
 */
ajweb.xml = {};
/**
 * 空のXMLドキュメントを生成
 */
ajweb.xml.createDocument = function(rootTagName){
  if(!rootTagName)
    rootTagName = "";
  var doc;
  if(document.implementation && document.implementation.createDocument) //IE以外
     doc = document.implementation.createDocument("", rootTagName, null);

  else {//IE
     doc = new ActiveXObject("MSXML2.DOMDocument");

    if(rootTagName){
      var prefix = "";
      var tagname = rootTagName;
      var p = rootTagName.indexOf(':');
      if(p != -1) {
	prefix = rootTagName.substring(0, p);
	tagname = rootTagName.substring(p + 1);
      }

      prefix = "";
      
      var text = "<" + (prefix ? (prefix + ":") : "") + tagname + "/>";
      doc.loadXML(text);
    }
  }
  if(!ajweb.Browser.Opera){
    var description  = doc.createProcessingInstruction("xml", 'version="1.0" encoding="UTF-8"');
    doc.insertBefore(description, doc.childNodes.item(0));
  }
  return doc;
};
/**
 * XMLドキュメント,またはノードをを文字列に変換
 */
ajweb.xml.serialize = function(node){
  if(typeof XMLSerializer != "undefined")
    return (new XMLSerializer()).serializeToString(node);
  else if (node.xml) return node.xml;
  else throw "XML.serialize is not supported or can't serialize " + node;
};
/**
 * XML文字列をパースしてXMLdocumentを返す
 * @param {String} text XML文字列
 */
ajweb.xml.parse = function(text){
  if (typeof DOMParser != "undefined"){
    var doc = (new DOMParser()).parseFromString(text, "application/xml");
    if(ajweb.Browser.WebKit){
      var description  = doc.createProcessingInstruction("xml", 'version="1.0" encoding="UTF-8"');
      doc.insertBefore(description, doc.childNodes.item(0));
    }
    return doc;
      
  }
  else if(typeof ActiveXObject != "undefined"){
    var doc = ajweb.xml.createDocument();
    doc.loadXML(text);
    return doc;
  }
  else {
    var url = "data:text/xml;charset=utf-8," + encodeURIComponect(text);
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    return request.responseXML;
  }
};

ajweb.xml.getCRChars = function(){
  var theAgent = navigator.userAgent;
  if (theAgent.indexOf("Win") >=0){
    return "\r\n";
  } else if(theAgent.indexOf("Mac") >=0){
    return "\r";
    
  } else {
    return "\n";
  }
};
ajweb.xml._xml = ajweb.xml.createDocument("base");

