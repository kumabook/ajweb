package ajweb.generator;

import java.io.File;
import java.io.IOException;

import junit.framework.TestCase;

import org.junit.Test;
import org.xml.sax.SAXException;

import ajweb.Config;
import ajweb.model.Application;
import ajweb.utils.FileUtils;


public class CompilerTest extends TestCase{
	
	
	@Test
	public void testParse() throws IOException, SAXException{
		Config.appName = "test";
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" + FileUtils.fs + "root.ajml");
		assertEquals("test", app.appName);
	}
	
	
	public void testSetup() throws Exception{
		Config.workDir = "test/app";
		Config.appName = "test";
		Compiler.setup(Config.workDir, Config.appName);
		File appDirectory = new File(Config.workDir + FileUtils.fs +  Config.appName);
//		File jslib = new File(Config.workDir + FileUtils.fs + appName + FileUtils.fs + "jslib");
		File web_inf = new File(Config.workDir + FileUtils.fs + Config.appName + FileUtils.fs + "WEB-INF");
		File classes = new File(Config.workDir + FileUtils.fs + Config.appName + FileUtils.fs + "WEB-INF" + FileUtils.fs + "classes");
		File src = new File(Config.workDir + FileUtils. fs + Config.appName + FileUtils.fs + "WEB-INF" + FileUtils.fs + "src");
		File lib = new File(Config.workDir + FileUtils.fs + Config.appName + FileUtils.fs + "WEB-INF"+ FileUtils.fs +FileUtils.fs +"lib");
		
		assertTrue(appDirectory.isDirectory());
	//	assertTrue(jslib.isDirectory());
		assertTrue(web_inf.isDirectory());
		assertTrue(classes.isDirectory());
		assertTrue(src.isDirectory());
		assertTrue(lib.isDirectory());
		
		//FileUtils.delete(new File(Config.workDir + FileUtils.fs + Config.appName));
	}
	
	public void testJavaCompile() throws Exception{
		//Compiler.javaCompile(Config.workDir, "test");
	}
	
	
	public void testGenerate() throws Exception{
		Config.appName = "test";
		Config.workDir = "test/app";
		
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" + FileUtils.fs + "chat.ajml");

		Compiler.setup(Config.workDir, Config.appName);
		//Compiler.generate(app, Config.workDir, "test.war");
		Compiler.generate(app, Config.workDir, "test.war");
		
		File war = new File("test.war");
		assertTrue(war.exists());
		//war.delete();
		
		File temp_dir = new File(Config.workDir + FileUtils.fs + Config.appName);
		FileUtils.delete(temp_dir);
		
		
	}

	
}
