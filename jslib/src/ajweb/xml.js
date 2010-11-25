dojo.require("dojox.xml.parser");
dojo.provide("ajweb.xml");

ajweb.xml = {};
ajweb.xml.serialize = function(node){
  if(typeof XMLSerializer != "undefined")
    return (new XMLSerializer()).serializeToString(node);
  else if (node.xml) return node.xml;
  else throw "XML.serialize is not supported or can't serialize " + node;
};
ajweb.xml.parse = function(text){
  if (typeof DOMParser != "undefined"){
    return(new DOMParser()).parseFromString(text, "application/xml");
  }
  else if(typeof ActiveXObject != "undefined"){
    var doc = XML.newDocument();
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