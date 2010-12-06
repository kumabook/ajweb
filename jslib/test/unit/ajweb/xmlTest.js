dojo.require("ajweb.xml");


function testCreateDocument(){
 var xml = ajweb.xml.createDocument("ajml");

 if(!ajweb.Browser.IE)
   assertTrue(xml instanceof XMLDocument);
  assertEquals(xml.documentElement.tagName, "ajml");

}

function testSerialize(){//ブラウザによって実装が違いすぎるので、あまり気にしない。最低限のテストにとどめる
   var xml = ajweb.xml.createDocument("ajml");
  var cr = ajweb.xml.getCRChars();
  var xml_str;

 if(ajweb.Browser.WebKit)
    xml_str = '<?xml version="1.0" encoding="UTF-8"?><ajml/>' + cr;
  else if(ajweb.Browser.IE)
    xml_str = '<?xml version="1.0"?>' + cr + '<ajml/>' + cr;
  else if(ajweb.Browser.Opera)
    xml_str = '<?xml version="1.0"?><ajml/>';
  else
    xml_str = '<?xml version="1.0" encoding="UTF-8"?>' + cr + '<ajml/>' + cr;
  if(!ajweb.Browser.IE)
    assertTrue(xml instanceof XMLDocument);

  assertEquals(dojo.trim(xml_str), dojo.trim(ajweb.xml.serialize(xml)));
  assertEquals(xml.documentElement.tagName, "ajml");
  var _xml = ajweb.xml.parse(xml_str);

  assertEquals(dojo.trim(xml_str), dojo.trim(ajweb.xml.serialize(_xml)));
}


function testParse(){

  var xml_str = '<?xml version="1.0" encoding="UTF-8"?><ajml/>';

  var xml = ajweb.xml.parse(xml_str);

  if(!ajweb.Browser.IE)
    assertTrue(xml instanceof XMLDocument);
  assertEquals(xml.documentElement.tagName, "ajml");

};

