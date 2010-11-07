dojo.require("ajweb.base");
dojo.require("ajweb.widget.SelectBox");
function testById(){
  var roomSelectBox = new ajweb.widget.SelectBox({id: "roomSelectBox", top: "50px", left: "100px", label: "name"});

  assertEquals(1, ajweb.elements.length);
  assertEquals("roomSelectBox", ajweb.byId("roomSelectBox").id);

};

