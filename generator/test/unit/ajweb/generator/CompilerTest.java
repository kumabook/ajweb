package ajweb.generator;

import static org.junit.Assert.*;
import java.io.File;
import java.io.IOException;
import org.junit.BeforeClass;
import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.Config;
import ajweb.model.Application;
import ajweb.utils.FileUtils;

public class CompilerTest {
	
	
	
	@BeforeClass
	public static void beforeClass() throws Exception{
		Config.isStandardOutput = false;
		Config.workDir = "test/temp/";
		
		
		

	}
	
	@Test
	public void testParse() throws IOException, SAXException{
		Application app = Compiler.parse(new File("test" + FileUtils.fs + "ajml" + FileUtils.fs + "root.ajml"));
		assertEquals("test", app.appName);
	}
	

	
	@Test
	public void testGenerateWar() throws Exception{
		
		Compiler.generateWar(new File("test" + FileUtils.fs + "ajml" + FileUtils.fs + "chat.ajml"), new File("test/temp/test.war"));
		File warFile = new File("test/temp/test.war");
		assertTrue(warFile.exists());		
		warFile.delete();
		File outDir = new File(Config.workDir + "/chat");
		outDir.delete();
		assertFalse(outDir.exists());
	}	
		
	
	@Test
	public void testJavaCompile() throws Exception{
		boolean result = Compiler.javaCompile("test/file/compile");
		assertTrue(result);
		File room_classes = new File("test/file/compile/WEB-INF/classes/ajweb/data/room.class");
		File message_classes = new File("test/file/compile/WEB-INF/classes/ajweb/data/message.class");
		File users_classes = new File("test/file/compile/WEB-INF/classes/ajweb/data/users.class");
		
		File servlet_classes = new File("test/file/compile/WEB-INF/classes/ajweb/servlet/AjWebServlet.class");
		File listener_classes = new File("test/file/compile/WEB-INF/classes/ajweb/servlet/AjWebListener.class");
		
		assertTrue(room_classes.exists());
		assertTrue(message_classes.exists());
		assertTrue(users_classes.exists());
		
		assertTrue(servlet_classes.exists());
		assertTrue(listener_classes.exists());
		
		FileUtils.delete(new File("test/file/compile/WEB-INF/classes/ajweb"));
		
		boolean false_result = Compiler.javaCompile("test/file/false_compile");
		assertFalse(false_result);
		
	}
	@Test
	public void testGenerateSource() throws Exception {
		String sourcePath = Config.workDir+"/test";
		Compiler.generateSource(new File("test" + FileUtils.fs + "ajml" + FileUtils.fs + "chat.ajml"), sourcePath);
		
		File sourceDir = new File(sourcePath);
		assertTrue(sourceDir.exists());
//		FileUtils.delete(sourceDir);
//		assertFalse(sourceDir.exists());
		
	}
	



	
	public static void afterClass(){
		//FileUtils.delete(new File(Config.workDir + FileUtils.fs + app.appName));
	}
	
}
