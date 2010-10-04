package ajweb.parser;

import static org.junit.Assert.assertEquals;
import java.io.IOException;
import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.generator.Compiler;
import ajweb.model.Application;

import ajweb.utils.FileUtils;


public class InterfacesHandlerTest {
	
	@Test
	public void testAjmlHandler() throws SAXException, IOException{
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "interfaces.ajml");
		//for(int i = 0; i < app.dbDatum.size(); i++){
		System.out.println(app.widgets);
		
	}
}
