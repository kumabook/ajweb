package ajweb.parser;

import java.io.IOException;

import org.junit.Test;
import org.xml.sax.SAXException;

import ajweb.generator.Compiler;
import ajweb.model.Application;
import ajweb.model.Call;
import ajweb.model.Event;
import ajweb.model.Events;
import ajweb.utils.FileUtils;
import junit.framework.TestCase;


public class EventsHandlerTest extends TestCase {
	@Test
	public void testEventsHandler() throws SAXException, IOException{
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "events.ajml");
		//for(int i = 0; i < app.dbDatum.size(); i++){
		
		assert(app.events instanceof Events);
		
		assert(app.events.get(0) instanceof Event);
		Event event0 = app.events.get(0);
		
		assertEquals(event0.target.toString(), "submit");
		assertEquals(event0.type, "click");
		
		assert(event0.action.get(0) instanceof Call);
		Call call0 = event0.action.get(0);
		assertEquals(call0.element, "chat_db");
		assertEquals(call0.func, "insert");
		
		assertEquals(call0.params.get(0).key, "message");
		assertEquals(call0.params.get(0).value.type, "value");
		assertEquals(call0.params.get(0).value.value, "message.value");
		
	}
		
	
}
