dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("ajweb.editor.base");
dojo.require("ajweb.xml");
dojo.require("ajweb.editor.Editor");
dojo.require("ajweb.editor.model.Application");
dojo.require("ajweb.editor.model.Eventable");

function testToXMLElement(){
var editor = new ajweb.editor.Editor();

//createModelにプロパティを渡せるように拡張しよう。
  var application =  new ajweb.editor.model.Application(
    {
      id: "application",
      tagName: "application",
      properties: { appName: "demo"},
      propertyList: ["appName"],
      acceptModelType: ["events, databases, interfaces"],
      editor: editor
    });
  editor.application = application;
  var interfaces = editor.createModel("interfaces", {}, application);
  var databases = editor.createModel("databases", {}, application, application.editor.centerTc);
  var events = editor.createModel("events", {}, application);

  var doc = ajweb.xml.createDocument("ajml");
  doc.documentElement.appendChild(application.toXMLElement());
  assertEquals("ajml", doc.documentElement.tagName);
  assertEquals("application", doc.documentElement.childNodes[0].tagName);
  assertEquals("demo", doc.documentElement.childNodes[0].getAttribute("appName"));
  assertEquals("interfaces", doc.documentElement.childNodes[0].childNodes[0].tagName);
  assertEquals("databases", doc.documentElement.childNodes[0].childNodes[1].tagName);
  assertEquals("events", doc.documentElement.childNodes[0].childNodes[2].tagName);
}


function testToSaveXMLElement(){

}


function testXmlToModel(){
var editor = new ajweb.editor.Editor("test");

  var xml_str =
'<?xml version="1.0" encoding="UTF-8"?>' +
 '<ajml>' +
  '<application appName="demo">' +
    '<events/>' +
    '<interfaces>' +
      '<panel content="undefined" height="300px" id="panel" width="300px"/>' +
    '</interfaces>' +
    '<databases>' +
      '<server dbDriver="org.apache.derby.jdbc.EmbeddedDriver" dbName="jdbc:derby:work/appName" id="server0" tablename="server0" type="server">' +
        '<property name="property1" type="int"/>' +
        '<property name="property2" type="string"/>' +
     '</server>' +
    '</databases>' +
  '</application>' +
'</ajml>';

  var xml =  ajweb.xml.parse(xml_str);
  assertEquals("ajml", xml.documentElement.tagName);
  assertEquals("application", xml.documentElement.childNodes[0].tagName);
  var application = new ajweb.editor.model.Application(
				   {
				     id: "application",
				     tagName: "application",
				     properties: { appName: "demo"},
				     propertyList: ["appName"],
				     acceptModelType : [],
				     editor: editor
				   });
  var attr = xml.documentElement.childNodes[0].attributes[0];


}

