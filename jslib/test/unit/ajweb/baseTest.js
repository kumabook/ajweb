dojo.require("ajweb.base");
dojo.require("ajweb.widget.Selectbox");

function testById(){
  var roomSelectbox = new ajweb.widget.Selectbox({id: "roomSelectbox", top: "50px", left: "100px", width: "100px", height: "100px", label: "name"});
  assertEquals(1, ajweb.elements.length);
  assertEquals("roomSelectbox", ajweb.byId("roomSelectbox").id);

};

