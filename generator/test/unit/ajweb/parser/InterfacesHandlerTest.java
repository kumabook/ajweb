package ajweb.parser;


import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;
import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.generator.Compiler;
import ajweb.model.Application;
import ajweb.model.Widget;
import ajweb.utils.FileUtils;

public class InterfacesHandlerTest {
	
	@Test
	public void testInterfacesHandler() throws SAXException, IOException{
		Application app = Compiler.parse(new File("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "interfaces.ajml"));
		//for(int i = 0; i < app.dbDatum.size(); i++){
		assertTrue(app instanceof Application);
		for(int i = 0; i < app.widgets.size(); i++){
			//assert(app.widgets.get(i) instanceof Widget);
			assertTrue(app.widgets.get(i) instanceof Widget);
		}
		//System.out.println(app.widgets);
	}
}
