package ajweb.model;

import static org.junit.Assert.*;


import java.io.File;
import java.io.IOException;

import org.junit.BeforeClass;
import org.junit.Test;
import org.xml.sax.SAXException;

import ajweb.generator.Compiler;
import ajweb.utils.FileUtils;

public class DatabaseTest {
	
	static Application app;
	static Databases databases;
	
	@BeforeClass
	public static void setUp(){
		try {
			app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "databases.ajml");
			databases = app.databases;
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void testToJavaSource() throws IOException, SAXException{
		assertEquals(databases.size(), 2);
		Database rooms = databases.get(0);
		
		File room = new File("test/file/source/room.java");
		assertEquals(rooms.toJavaSource(), FileUtils.read(room));
		//System.out.println(FileUtils.read(room));
		//System.out.println(databases.get(1).toJavaSource());
	}
	
	@Test
	public void testToServletSource() throws IOException{
		assertEquals(app.appName, "chat");
		assertEquals(databases.size(), 2);
		assertEquals(databases.get(0).tablename, "room");
		
		File servlet = new File("test/file/source/servlet.java");
		assertEquals(FileUtils.read(servlet), databases.toServletSource(app.appName));
	}
		
	@Test
	public void testToListenerSource() throws IOException{
		File listener = new File("test/file/source/listener.java");
		String source = databases.toListenerSource();
		assertEquals(FileUtils.read(listener), source);
	}
	
	@Test
	public void testJsSource() throws IOException{
		assertEquals(databases.size(), 2);
		Database message_database = databases.get(1);
		
		File database_js = new File("test/file/source/database.js");
		assertEquals(FileUtils.read(database_js), message_database.toJsSource());
	}
		
}
