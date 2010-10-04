package ajweb.parser;

import java.util.ArrayList;
import java.util.HashMap;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import ajweb.db.AbstractCondition;
import ajweb.model.Event;
import ajweb.model.Expression;
import ajweb.model.Widget;
import ajweb.utils.Log;


public class WidgetHandler extends AbstractHandler {

	Widget widget = new Widget();
	AbstractHandler parent;
	ArrayList<HashMap<String, String>> tableStructure = new ArrayList<HashMap<String, String>>();
	String data;
	String tablename;
	ArrayList<Widget> children = new ArrayList<Widget>();
	
	public void startElement(String uri, String localName, String qName, Attributes attrs)
    throws SAXException {
		Log.fine("\t\tWidget Handler startElemnt: " + qName);
		if(qName.equals("th")){
			HashMap<String, String> th = new HashMap<String, String>();
			for(int i = 0; i < attrs.getLength(); i++){				
				th.put(attrs.getQName(i), attrs.getValue(i));
			}
			tableStructure.add(th);
		}
		else if(qName.equals("data")){
			data = attrs.getValue("id");
			tablename = attrs.getValue("tablename");
		}
		else 
			super.startElement(uri, localName, qName, attrs);
	}
	
	@Override
		protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Widget){
			widget.children.add((Widget) exp);
		}
		else if(exp instanceof Event){
			Event event = (Event) exp;
			event.element = attributes.get("id");
			this.widget.events.add(event);
		}
		else if(exp instanceof AbstractCondition){
				this.widget.properties.put("data_exp", (AbstractCondition)exp);
				Log.finer("put data_exp: " + exp.toString());
		}
		else
			throw new SAXException("this is not event element:" + exp);

		}
	
	
	public void initialize(XMLReader newReader, AbstractHandler initParent,
            Attributes attrs,String elementName) throws SAXException {
		Log.fine("\t\tWidget Handler init: " + elementName);
		parent = initParent;
		super.initialize(newReader, initParent, attrs, elementName);
	}
	
	@SuppressWarnings("unchecked")
	public void endElement(String uri, String localName, String qName) throws SAXException{
		Log.fine("\t\tWidget Handler endElement: " + qName);
		
		if(qName.equals("th") || qName.equals("data")) return;
		
		

		
		
		
		widget.id = (String) attributes.get("id");
		widget.type = elementName;
		
		if (data != null) {
			widget.properties.put("structure", tableStructure);
			widget.properties.put("data", data);
			widget.properties.put("tablename", tablename);	
		}
		
//		System.out.println(qName + "   before  " + widget.properties);
		HashMap<String, Object> props = (HashMap) attributes;
//		System.out.println("attributes  " + attributes);
		widget.properties.putAll(props);
//		System.out.println("after   " + widget.properties);
		setExpression(widget);

		super.endElement(uri, localName, qName);
	}
	
	
	

	public String toString(){
		return "WidgetHandler";
	}
}
