package ajweb.model;

import static org.junit.Assert.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
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
	@BeforeClass
	public static void setUp() throws Exception{
		Config.isStandardOutput = false;
		Config.workDir = "test/temp/";
		
		try {
			app = Compiler.parse(new File("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "chat.ajml"));
			app.outDir = Config.workDir + app.appName;
			Compiler.setup(app.outDir);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void testHtmlGenerate() throws FileNotFoundException, UnsupportedEncodingException, IOException{
		app.htmlGenerate();
		File index_html = new File(app.outDir+ "/index.html");
		assertTrue(index_html.exists());
	}
	
	@Test
	public void testCssGenerate() throws FileNotFoundException, UnsupportedEncodingException, IOException{
		app.cssGenerate();
		File index_css = new File(app.outDir + "/index.css");
		assertTrue(index_css.exists());
	}
	
	@Test
	public void testJsGenerate() throws IOException{
		app.jsGenerate();
		File index_js = new File(app.outDir + "/index.js");
		assertTrue(index_js.exists());
	}
	
	@Test
	public void testDatabaseGenerate() throws Exception{
		app.databaseGenerate();
		File room_java = new File(app.outDir + "/WEB-INF/src/ajweb/data/"+ app.databases.get(0).tablename + ".java");
		File message_java = new File(app.outDir + "/WEB-INF/src/ajweb/data/" + app.databases.get(1).tablename + ".java");
		File users_java = new File(app.outDir + "/"+ "/WEB-INF/src/ajweb/data/" + app.databases.get(1).tablename + ".java");
		
		assertTrue(room_java.exists());
		assertTrue(message_java.exists());
		assertTrue(users_java.exists());
	}
	
	@Test
	public void testServletGenerate() throws IOException{
		app.servletGenerate();
		File servlet = new File(app.outDir + "/WEB-INF/src/ajweb/servlet/AjWebServlet.java");
		File listener = new File(app.outDir + "/WEB-INF/src/ajweb/servlet/AjWebListener.java");
		
		assertTrue(servlet.exists());
		assertTrue(listener.exists());
	}
	
	@AfterClass
	public static void tearDown(){
		File dir = new File(app.outDir);
		FileUtils.delete(dir);
	}
	
	
}
