package ajweb.parser;

import java.io.IOException;

import junit.framework.TestCase;

import org.junit.Test;
import org.xml.sax.SAXException;

import ajweb.model.Application;
import ajweb.model.Database;
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
			assertEquals(rooms.properties.get("user"), "string");
			
			Database messages = app.databases.get(1);
			assertEquals(messages.name, "messages");
			assertEquals(messages.properties.get("message"), "string");
			assertEquals(messages.properties.get("posted"), "datetime");
			assertEquals(messages.properties.get("user"), "string");
			assertEquals(messages.properties.get("roomId"), "int");
			
	}
	
}
