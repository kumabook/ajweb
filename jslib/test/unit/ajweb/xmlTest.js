dojo.require("ajweb.xml");


function testParse(){
  var xml_str = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<ajml/>';

  var xml = ajweb.xml.parse(xml_str);
  assertEquals(xml_str, ajweb.xml.serialize(xml));
};

