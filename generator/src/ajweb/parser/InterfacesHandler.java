package ajweb.parser;

import java.util.ArrayList;
import java.util.HashMap;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;


import ajweb.db.AbstractCondition;
import ajweb.model.Event;
import ajweb.model.Expression;
import ajweb.model.Widget;
import ajweb.utils.Log;

public class InterfacesHandler extends AbstractHandler {
	Widget widget = new Widget();
	ArrayList<HashMap<String, String>> tableStructure = new ArrayList<HashMap<String, String>>();
	String data;
	
	public void startElement(String uri, String localName, String qName, Attributes attrs)
    throws SAXException {
		Log.fine("\t\tInterfaces Handler startElemnt: " + qName);
		super.startElement(uri, localName, qName, attrs);
		
	}
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
	if(exp instanceof Event){
		Event event = (Event) exp;
		event.target = attributes.get("id");
		this.widget.events.add(event);
	}
	else if(exp instanceof AbstractCondition){
			this.widget.properties.put("data_exp", (AbstractCondition)exp);
			Log.finer("put data_exp: " + exp.toString());
	}
	else if(exp instanceof Widget)
		this.widget.children.add((Widget) exp);
	else throw new SAXException("this is not widget element:" + exp);
	//	throw new SAXException("this is not event element:" + exp);
	}

		
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void endElement(String uri, String localName, String qName) throws SAXException{
		Log.fine("\t\tInterfaces Handler endElement: " + qName);
		
		if(qName.equals("th") || qName.equals("data")) return;
		
		widget.id = (String) attributes.get("id");
		widget.type = elementName;
		
		if (data != null) {
			widget.properties.put("structure", tableStructure);
			widget.properties.put("data", data);
		}
		
		
		HashMap<String, Object> props = (HashMap) attributes;
		widget.properties.putAll(props);
		setExpression(widget);
		
		if(qName.equals("interfaces")){
			//System.out.println("test  " + widget.children.get(0));
			this.setExpression(widget);
			super.endElement(uri, localName, qName);
		}
	}
}
