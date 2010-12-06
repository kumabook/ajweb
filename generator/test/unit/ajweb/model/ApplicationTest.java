package ajweb.model;

import static org.junit.Assert.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintStream;
import java.io.UnsupportedEncodingException;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.Config;
import ajweb.utils.FileUtils;
import ajweb.generator.Compiler;

public class ApplicationTest{
	static Application app;
	static String outDir;
	@BeforeClass
	public static void setUp() throws Exception{
		new File("test/temp/").mkdirs();
		new File("test/temp/test.log").createNewFile();
		Config.out = new PrintStream("test/temp/test.log");
		Config.workDir = "test/temp/";
		
		try {
			app = Compiler.parse(new File("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "chat.ajml"));
			outDir = Config.workDir + app.appName;
			app.setup(outDir);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
	}
	@Test
	public void testSetup() throws Exception{
		Application app = Compiler.parse(new File("test" + FileUtils.fs + "ajml" + FileUtils.fs + "root.ajml"));
		app.setup(Config.workDir + "/" + app.appName);
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

	}
	
	@Test
	public void testHtmlGenerate() throws FileNotFoundException, UnsupportedEncodingException, IOException{
		app.htmlGenerate(outDir);
		File index_html = new File(outDir+ "/index.html");
		assertTrue(index_html.exists());
	}
	
	@Test
	public void testCssGenerate() throws FileNotFoundException, UnsupportedEncodingException, IOException{
		app.cssGenerate(outDir);
		File index_css = new File(outDir + "/index.css");
		assertTrue(index_css.exists());
	}
	
	@Test
	public void testJsGenerate() throws IOException{
		app.jsGenerate(outDir);
		File index_js = new File(outDir + "/index.js");
		assertTrue(index_js.exists());
	}
	
	@Test
	public void testDatabaseGenerate() throws Exception{
		app.databaseGenerate(outDir);
		File room_java = new File(outDir + "/WEB-INF/src/ajweb/data/"+ app.databases.get(0).tablename + ".java");
		File message_java = new File(outDir + "/WEB-INF/src/ajweb/data/" + app.databases.get(1).tablename + ".java");
		File users_java = new File(outDir + "/"+ "/WEB-INF/src/ajweb/data/" + app.databases.get(1).tablename + ".java");
		
		assertTrue(room_java.exists());
		assertTrue(message_java.exists());
		assertTrue(users_java.exists());
	}
	
	@Test
	public void testServletGenerate() throws IOException{
		app.servletGenerate(outDir);
		File servlet = new File(outDir + "/WEB-INF/src/ajweb/servlet/AjWebServlet.java");
		File listener = new File(outDir + "/WEB-INF/src/ajweb/servlet/AjWebListener.java");
		
		assertTrue(servlet.exists());
		assertTrue(listener.exists());
	}
	
	@AfterClass
	public static void tearDown(){
		File dir = new File(outDir);
		FileUtils.delete(dir);
	}
	
	
}
