dojo.require("dijit.layout.TabContainer");
dojo.require("ajweb.editor.base");
dojo.require("ajweb.editor.model.Model");
dojo.require("ajweb.editor.model.Eventable");
dojo.require("ajweb.editor.ModelEditor");
function testToXMLElement(){
//  ajweb.editor.modelEditor = new ajweb.editor.ModelEditor("ajmlEditor", "menu");
  ajweb.editor.modelEditor.centerTc = new dijit.layout.TabContainer(
    {
      "id" : "centerTc",
      "region": "center"
    }, "centerTc"
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
		eventList: [],
		elementType: "databases",
		container: ajweb.editor.modelEditor.centerTc,
		parent: application,
		acceptComponentType: ["database"]
	      }
	    );


}


function testToXML(){

}


function testParse(){

}

