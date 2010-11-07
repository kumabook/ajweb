package ajweb.parser;


import ajweb.generator.Compiler;
import ajweb.model.Application;

import java.io.IOException;

import org.junit.Test;
import org.xml.sax.SAXException;


import ajweb.utils.FileUtils;

public class ApplicationHandlerTest {
	
	@SuppressWarnings("unused")
	@Test
	public void testApplicationHandler() throws SAXException, IOException{
		//FileInputStream fi = new FileInputStream("resources" + FileUtils.fs + "test" +  FileUtils.fs + "root.ajml");
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "root.ajml");
		
		
	}			
}
