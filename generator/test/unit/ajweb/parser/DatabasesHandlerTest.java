package ajweb.parser;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.model.Application;
import ajweb.model.Database;
import ajweb.model.Items;
import ajweb.model.Param;
import ajweb.generator.Compiler;
import ajweb.utils.FileUtils;

public class DatabasesHandlerTest {
	
	@Test
	public void testDatabasesHandler() throws SAXException, IOException{
		Application app = Compiler.parse(new File("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "databases.ajml"));
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
			
			
			assertEquals(5, room.initItems.size());
			assertEquals(0, message.initItems.size());
			
			
			//ArrayList<HashMap<String, Parameterable>> items = room.initItem;
			Items items = room.initItems;
			
			assertEquals(Param.paramToJavaSource(items.get(0)), "{\\\\\\\\\"name\\\\\\\\\": \\\\\\\\\"ƒ‹[ƒ€‚P\\\\\\\\\"}");
			assertEquals(Param.paramToJavaSource(items.get(1)), "{\\\\\\\\\"name\\\\\\\\\": \\\\\\\\\"ƒ‹[ƒ€‚Q\\\\\\\\\"}");
			assertEquals(Param.paramToJavaSource(items.get(2)), "{\\\\\\\\\"name\\\\\\\\\": \\\\\\\\\"ƒ‹[ƒ€‚R\\\\\\\\\"}");
			assertEquals(Param.paramToJavaSource(items.get(3)), "{\\\\\\\\\"name\\\\\\\\\": \\\\\\\\\"ƒ‹[ƒ€‚S\\\\\\\\\"}");
			assertEquals(Param.paramToJavaSource(items.get(4)), "{\\\\\\\\\"name\\\\\\\\\": \\\\\\\\\"ƒ‹[ƒ€‚T\\\\\\\\\"}");
			
	}
	
}
