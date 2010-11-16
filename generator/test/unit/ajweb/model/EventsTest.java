package ajweb.model;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import org.junit.BeforeClass;
import org.junit.Test;
import org.xml.sax.SAXException;

import ajweb.utils.FileUtils;
import ajweb.generator.Compiler;

public class EventsTest {
	static Application app;
	Events events;
	
	@BeforeClass
	public static void setUp(){
		try {
			app = Compiler.parse(new File("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "chat.ajml"));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void testToJsSource() throws IOException, SAXException{
		events = app.events;
	//	System.out.println(events.toJsSource(app.databases));
	}
	
	@Test
	public void testToJsSourceCall() throws IOException{
		Action action = app.events.get(0).action;
		assertEquals(1, action.size());
		Call call = (Call) action.get(0);
		assertEquals("root.selectPanel({panel:\"loginPanel\"});", call.toJsSource(null, null, new Action()));
	}
	
	@Test
	public void testToJsSourceGet() throws IOException{
		Action action = new Action();
		
		ArrayList<Param> params = new ArrayList<Param>();
		params.add(new Param("datum1", new Get("room", "select", null, new ArrayList<Param>())));
		params.add(new Param("datum2", new Get("message", "select", null, new ArrayList<Param>())));
		Call call = new Call("roomSelect", "load", params);
		
		assertEquals(2, call.params.size());
		assertEquals("datum1", call.params.get(0).key);
		Get get = (Get) call.params.get(0).value;
		assertEquals("room", get.element);
		assertEquals("select", get.getter);
		
		ArrayList<Param> params1 = new ArrayList<Param>();
		params1.add(new Param("datum1", new Get("select", "room1", null, new ArrayList<Param>())));
		params1.add(new Param("datum2", new Get("message1", "select", null, new ArrayList<Param>())));
		Call call1 = new Call("table", "load", params1);
		
		action.add(call);
		action.add(call1);
		//System.out.println(action.toJsSource(null, null, action));
	}
	
	@Test
	public void testToJsSourceCondition() throws IOException{
//		Condition con = new Condition("eq", new ReceivedItem("room"), new Get("room_database", "get", "SelectItem", new ArrayList<Param>()));
		//System.out.println(con.toJsSource(null, null, null));
	}
	
	@Test
	public void testToJsSourceParam() throws IOException{
		ArrayList<Param> params = new ArrayList<Param>();
		params.add(new Param("key", new Get("selectBox", "get", "selectItem")));
		params.add(new Param("key1", new Primitive("int", "1")));
		params.add(new Param("key2", new Primitive("string", "test")));
		Get select = new Get("select", "selectId", null, params);
		assertEquals("{ key: selectBox.getselectItem(), key1: 1, key2: \"test\"}", select.paramToJsSource(null, null, null));
	}
	
	//@Test
	//public void test
	
}
