package ajweb.parser;

import java.io.IOException;

import junit.framework.TestCase;

import org.junit.Test;
import org.xml.sax.SAXException;
import ajweb.generator.Compiler;
import ajweb.model.Application;
import ajweb.model.Widget;

import ajweb.utils.FileUtils;


public class InterfacesHandlerTest extends TestCase{
	
	@Test
	public void testInterfacesHandler() throws SAXException, IOException{
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "interfaces.ajml");
		//for(int i = 0; i < app.dbDatum.size(); i++){
		assert(app instanceof Application);
		for(int i = 0; i < app.widgets.size(); i++){
			//assert(app.widgets.get(i) instanceof Widget);
			assertWidget(app.widgets.get(i));
		}
		//System.out.println(app.widgets);
	}
	
	public void assertWidget(Widget w) {
		for(int i = 0; i < w.children.size(); i++){
			assert(w.children.get(i) instanceof Widget);
			assertWidget(w.children.get(i));
		}
	}
}
