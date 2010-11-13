package ajweb.model;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;
import org.junit.After;
import org.junit.BeforeClass;
import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.Config;
import ajweb.utils.FileUtils;
import ajweb.generator.Compiler;

public class ApplicationTest{
	static Application app;
	@BeforeClass
	public static void setUp(){
		Config.isStandardOutput = false;
		Config.workDir = "test/temp";		
		try {
			app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "chat.ajml");
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void testGenerate(){
		
	}
	@Test
	public void testHtmlGenerate(){
		
	}
	@Test
	public void testJsGenerate(){
		
	}
	@Test
	public void testDatabaseGenerate() throws Exception{
		assertEquals("chat", app.appName);
		
		Compiler.setup(app.workDir, app.appName);
		app.databaseGenerate();
		
		File room_java = new File(app.workDir + "/"+  app.appName + "/WEB-INF/src/ajweb/db/"+ app.databases.get(0).tablename + ".java");
		File message_java = new File(app.workDir + "/"+  app.appName + "/WEB-INF/src/ajweb/db/" + app.databases.get(1).tablename + ".java");
		
		assertTrue(message_java.exists());
	}
	@Test
	public void testServletGenerate(){
		
	}
	@After
	public void tearDown(){
		File dir = new File(app.workDir + "/" + app.appName);
		FileUtils.delete(dir);
	}
	
}
