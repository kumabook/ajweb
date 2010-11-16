package ajweb.parser;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;
import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.generator.Compiler;
import ajweb.model.Application;
import ajweb.model.Call;
import ajweb.model.Event;
import ajweb.model.Events;
import ajweb.utils.FileUtils;

public class EventsHandlerTest{
	@Test
	public void testEventsHandler() throws SAXException, IOException{
		Application app = Compiler.parse(new File("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "events.ajml"));
		//for(int i = 0; i < app.dbDatum.size(); i++){
		
		assert(app.events instanceof Events);
		assertEquals(app.events.size(), 6);
		assert(app.events.get(0) instanceof Event);
		Event event0 = app.events.get(0);
		
		assertEquals(event0.target.toString(), "root");
		assertEquals(event0.type, "display");
		
		assert(event0.action.get(0) instanceof Call);
		
		//Call call0 = event0.action.get(0);
		//assertEquals(call0.element, "chat_db");
		//assertEquals(call0.func, "insert");
		//assertEquals(call0.toJsCode(), "chat_db.insert({message:message.getValue(),user_name:user_name.getValue(),room_id:\"1\",posted:ajweb.Datime(0)});");
	}
		
	
}
