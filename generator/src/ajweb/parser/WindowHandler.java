package ajweb.parser;

import java.util.HashMap;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

import ajweb.model.Expression;
import ajweb.model.Widget;
import ajweb.model.Window;
import ajweb.utils.Log;

public class WindowHandler extends AbstractHandler {
	Window window = new Window();

	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) throws SAXException {
		super.startElement(uri, localName, qName, attrs);
		Log.fine("\twindow handler start");
	}
	
	public void initialize(XMLReader newReader, AbstractHandler initParent,
		Attributes attrs,String elementName) throws SAXException {
		super.initialize(newReader, initParent, attrs, elementName);
	}
	
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
			Log.fine("\twindow handler end : " + qName);
			window.id = attributes.get("id");
			window.default_container = attributes.get("default");
			window.type = elementName;
			HashMap<String, Object> props = (HashMap) attributes;
//			System.out.println("attributes  " + attributes);
			window.properties.putAll(props);
//			System.out.println("after   " + window.properties);
		//			window.properties
			setExpression(window);
			super.endElement(uri, localName, qName);
	}
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
//		System.out.println(elementName +  " " + attributes.get("id") + "     children     "+exp);
		if(exp instanceof Widget)
			this.window.widgets.add((Widget) exp);
		else if(exp instanceof Window)
			this.window.containers.add((Window) exp);
		else throw new SAXException("this is not widget element:" + exp);
	}
	
}
