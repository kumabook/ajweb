package ajweb.parser;

import static org.junit.Assert.*;

import java.io.IOException;

import org.junit.Test;
import org.xml.sax.SAXException;

import ajweb.model.Application;
import ajweb.model.DBData;
import ajweb.generator.Compiler;
import ajweb.utils.FileUtils;

public class DatabasesHandlerTest {
	
	@Test
	public void testAjmlHandler() throws SAXException, IOException{
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "databases.ajml");
		//for(int i = 0; i < app.dbDatum.size(); i++){
			DBData rooms = app.dbDatum.get(0);
			assertEquals(rooms.name, "rooms");
			assertEquals(rooms.properties.get("name"), "string");
			assertEquals(rooms.properties.get("user"), "string");
			
			DBData messages = app.dbDatum.get(1);
			assertEquals(messages.name, "messages");
			assertEquals(messages.properties.get("message"), "string");
			assertEquals(messages.properties.get("posted"), "datetime");
			assertEquals(messages.properties.get("user"), "string");
			assertEquals(messages.properties.get("roomId"), "int");
			
	}
	
}
