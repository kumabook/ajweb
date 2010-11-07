package ajweb.parser;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import junit.framework.TestCase;

import org.junit.Test;
import org.xml.sax.SAXException;

import ajweb.model.Application;
import ajweb.model.Database;
import ajweb.model.Parameterable;
import ajweb.generator.Compiler;
import ajweb.utils.FileUtils;

public class DatabasesHandlerTest extends TestCase{
	
	@Test
	public void testDatabasesHandler() throws SAXException, IOException{
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "databases.ajml");
		//for(int i = 0; i < app.dbDatum.size(); i++){
			Database rooms = app.databases.get(0);
			assertEquals(rooms.name, "rooms");
			assertEquals(rooms.properties.get("name"), "string");

			
			Database messages = app.databases.get(1);
			assertEquals(messages.name, "messages");
			assertEquals(messages.properties.get("message"), "string");
			assertEquals(messages.properties.get("posted"), "datetime");
			assertEquals(messages.properties.get("user"), "string");
			assertEquals(messages.properties.get("roomId"), "int");
			
			ArrayList<HashMap<String, Parameterable>> items = rooms.initItem;
			
			assertEquals(items.get(0).get("name").toString(), "ƒ‹[ƒ€‚P");
			assertEquals(items.get(1).get("name").toString(), "ƒ‹[ƒ€‚Q");
			assertEquals(items.get(2).get("name").toString(), "ƒ‹[ƒ€‚R");
			assertEquals(items.get(3).get("name").toString(), "ƒ‹[ƒ€‚S");
			assertEquals(items.get(4).get("name").toString(), "ƒ‹[ƒ€‚T");
			
	}
	
}
