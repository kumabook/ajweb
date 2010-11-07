package ajweb.model;

import java.io.File;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Test;


import ajweb.Config;
import ajweb.utils.FileUtils;
import ajweb.generator.Compiler;

import junit.framework.TestCase;


public class ApplicationTest extends TestCase{
	@AfterClass
	public void setConfig(){
		Config.appName = "test";
		Config.workDir = "test/app";		
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
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "chat.ajml");
		Compiler.setup(Config.workDir, Config.appName);
		app.databaseGenerate();
		File room_java = new File(Config.workDir + "/"+  Config.appName + "/WEB-INF/src/ajweb/db/"+ app.databases.get(0).name + ".java");
		File message_java = new File(Config.workDir + "/"+  Config.appName + "/WEB-INF/src/ajweb/db/" + app.databases.get(1).name + ".java");
		
		assertTrue(room_java.exists());
		assertTrue(message_java.exists());
	}
	@Test
	public void testServletGenerate(){
		
	}
	@After
	public void tearDown(){
		File dir = new File(Config.workDir + "/" + Config.appName);
		FileUtils.delete(dir);
	}
	
}
