package ajweb.parser;

import static org.junit.Assert.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.model.Application;
import ajweb.model.Database;
import ajweb.model.Parameterable;
import ajweb.generator.Compiler;
import ajweb.utils.FileUtils;

public class DatabasesHandlerTest {
	
	@Test
	public void testDatabasesHandler() throws SAXException, IOException{
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "databases.ajml");
		//for(int i = 0; i < app.dbDatum.size(); i++){
			Database room = app.databases.get(0);
			assertEquals(room.id, "room_database");
			assertEquals(room.tablename, "room");
			assertEquals(room.type, "server");
			assertEquals(room.persistence, "permanent");
			
			assertEquals(room.properties.get("name"), "string");

			ArrayList<HashMap<String, String>> room_ref = room.ref;
			assertEquals(room_ref.size(), 1);
			
			assertEquals(room_ref.get(0).get("table"), "message");
			assertEquals(room_ref.get(0).get("multiplicity"), "*");
			
			Database message = app.databases.get(1);
			assertEquals(message.id, "message_database");
			assertEquals(message.tablename, "message");
			assertEquals(message.properties.get("message"), "string");
			assertEquals(message.properties.get("posted"), "datetime");
			assertEquals(message.properties.get("user"), "string");
			assertEquals(message.properties.get("room"), "ref");
			
			ArrayList<HashMap<String, String>> message_ref = message.ref;
			assertEquals(message_ref.size(), 1);
			
			assertEquals(message_ref.get(0).get("table"), "room");
			assertEquals(message_ref.get(0).get("multiplicity"), "1");
			
			
			
			ArrayList<HashMap<String, Parameterable>> items = room.initItem;
			
			assertEquals(items.get(0).get("name").toString(), "ƒ‹[ƒ€‚P");
			assertEquals(items.get(1).get("name").toString(), "ƒ‹[ƒ€‚Q");
			assertEquals(items.get(2).get("name").toString(), "ƒ‹[ƒ€‚R");
			assertEquals(items.get(3).get("name").toString(), "ƒ‹[ƒ€‚S");
			assertEquals(items.get(4).get("name").toString(), "ƒ‹[ƒ€‚T");
			
	}
	
}
