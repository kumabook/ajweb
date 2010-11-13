package ajweb.generator;

import static org.junit.Assert.*;
import java.io.File;
import java.io.IOException;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.Config;
import ajweb.model.Application;
import ajweb.utils.FileUtils;

public class CompilerTest {
	
	Application app;
	
	@Before
	public void setUp(){
		Config.isStandardOutput = false;
		try {
			app = Compiler.parse("test" + FileUtils.fs + "ajml" + FileUtils.fs + "root.ajml");
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}		
	}
	@Test
	public void testParse() throws IOException, SAXException{
		assertEquals("test", app.appName);
	}
	
	@Test
	public void testSetup() throws Exception{
		Config.workDir = "test/temp";
		
		Compiler.setup(Config.workDir, "test");
		File appDirectory = new File(Config.workDir + FileUtils.fs +  app.appName);
//		File jslib = new File(Config.workDir + FileUtils.fs + appName + FileUtils.fs + "jslib");
		File web_inf = new File(Config.workDir + FileUtils.fs + app.appName + FileUtils.fs + "WEB-INF");
		File classes = new File(Config.workDir + FileUtils.fs + app.appName + FileUtils.fs + "WEB-INF" + FileUtils.fs + "classes");
		File src = new File(Config.workDir + FileUtils. fs + app.appName + FileUtils.fs + "WEB-INF" + FileUtils.fs + "src");
		File lib = new File(Config.workDir + FileUtils.fs + app.appName + FileUtils.fs + "WEB-INF"+ FileUtils.fs +FileUtils.fs +"lib");
		
		assertTrue(appDirectory.isDirectory());
	//	assertTrue(jslib.isDirectory());
		assertTrue(web_inf.isDirectory());
		assertTrue(classes.isDirectory());
		assertTrue(src.isDirectory());
		assertTrue(lib.isDirectory());
		
		FileUtils.delete(new File(Config.workDir + FileUtils.fs + "test"));
	}
	@Test
	public void testJavaCompile() throws Exception{
		//Compiler.javaCompile(Config.workDir, "test");
	}
	
	
	public void testGenerate() throws Exception{
		Config.workDir = "test/temp";
		
		Application app_chat = Compiler.parse("test" + FileUtils.fs + "ajml" + FileUtils.fs + "chat.ajml");

		Compiler.setup(Config.workDir, app_chat.appName);
		//Compiler.generate(app, Config.workDir, "test.war");
		Compiler.generate(app, Config.workDir, "test.war");
		
		File war = new File("test.war");
		assertTrue(war.exists());
		//war.delete();
		
		File temp_dir = new File(Config.workDir + FileUtils.fs + app_chat.appName);
		FileUtils.delete(temp_dir);
		
		
	}

	
}
