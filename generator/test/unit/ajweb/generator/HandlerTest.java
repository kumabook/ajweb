package ajweb.generator;



import java.io.FileInputStream;
import java.io.IOException;

import junit.framework.TestCase;

import org.junit.*;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

import ajweb.parser.AjmlHandler;
import ajweb.utils.FileUtils;

public class HandlerTest extends TestCase{
	
	@Test
	public void testAjmlHandler() throws SAXException, IOException{
		FileInputStream fi = new FileInputStream("resources" + FileUtils.fs + "test" +  FileUtils.fs + "root.ajml");
		
		final XMLReader r = XMLReaderFactory.createXMLReader();
		//r.setErrorHandler(new SchemaErr());
		r.setFeature("http://xml.org/sax/features/validation", true);
		r.setFeature("http://apache.org/xml/features/validation/schema", true);
		r.setFeature("http://xml.org/sax/features/namespaces", true);
		r.setContentHandler(new AjmlHandler(){
			{ 
				reader = r ;
				//logger = Main.logger;
			}
		});
	
		r.parse(new InputSource(fi));
		fi.close();
	}
	

}
