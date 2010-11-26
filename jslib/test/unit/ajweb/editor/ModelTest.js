dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("ajweb.editor.base");
dojo.require("ajweb.editor.model.Model");
dojo.require("ajweb.editor.model.Eventable");

  var propertyDataStore = new dojo.data.ItemFileWriteStore(
	{
	  identifier: "id",
	  data: {  items: [] }
	}
      );

  var centerTc = new dijit.layout.TabContainer(
      {
	id : "centerTc",
	region: "center"
      }
    );

  var eventTc = new dijit.layout.TabContainer(
      {
	id: "eventTc",
	tabPosition: "left-h",
	title: "event"
      }
    );

  var application = new ajweb.editor.model.Model(
		      {
			id: "application",
			tagName: "application",
			properties: { appName: "demo"},
			propertyList: ["appName"]
		      });
  var events = new ajweb.editor.model.Model(
		 {
		   id: "events",
		   tagName: "events",
		   properties: {},
		   propertyList: [],
		   parent : application
		 });

  var databases  = new ajweb.editor.model.Eventable(
	      {
		id: "databases",
		tagName :"databases",
		properties:
		  {
		    tagName :"databases"
		  },
		propertyList: ["tagName"],
		propertyDataStore: propertyDataStore,
		eventList: [],
		eventTc: eventTc,
		elementType: "databases",
		container: centerTc,
		parent: application,
		acceptComponentType: ["database"]
	      }
  );

function testToXMLElement(){
  var doc = ajweb.xml.createDocument("ajml");
  doc.documentElement.appendChild(application.toXMLElement());
  assertEquals("ajml", doc.documentElement.tagName);
  assertEquals("application", doc.documentElement.childNodes[0].tagName);
  assertEquals("demo", doc.documentElement.childNodes[0].getAttribute("appName"));
  assertEquals("events", doc.documentElement.childNodes[0].childNodes[0].tagName);
  assertEquals("databases", doc.documentElement.childNodes[0].childNodes[1].tagName);
  //alert(ajweb.xml.serialize(doc));
}


function testToSaveXMLElement(){
  
}


function testParse(){
  
}

