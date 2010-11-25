package ajweb.model;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import org.junit.Test;
import org.xml.sax.SAXException;

import ajweb.utils.FileUtils;
import ajweb.generator.Compiler;

public class InterfacesTest {
	Application app;
	Databases databases;
	
	@Test
	public void testToJsSource() throws IOException, SAXException{
		app = Compiler.parse(new File("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "interfaces.ajml"));
		
		String INTERFACES = "";
		Widget interfaces = app.widgets.get(0);
		
		interfaces.children.get(0).name = "rootFrame"; 
		HashMap<String, Object> rootProperties = new HashMap<String, Object>();
		rootProperties.put("id", "rootFrame");
		rootProperties.put("width", "100%");
		rootProperties.put("height", "100%");
		rootProperties.put("top", "0px");
		rootProperties.put("left", "0px");
		
		interfaces.children.get(0).properties = rootProperties;
		
		for(int i = 0; i < interfaces.children.size(); i++){
			INTERFACES += interfaces.children.get(i).toJsSource();
		}
		
		File widget = new File("test/file/source/widget.js");
		
		assertEquals(INTERFACES.trim(), FileUtils.read(widget).trim());
		
	}
}
