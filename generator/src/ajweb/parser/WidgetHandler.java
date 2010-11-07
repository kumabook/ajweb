package ajweb.parser;


import java.util.ArrayList;

import java.util.HashMap;
import org.xml.sax.SAXException;
import ajweb.db.AbstractCondition;
import ajweb.model.Event;
import ajweb.model.Expression;
import ajweb.model.Widget;
import ajweb.utils.Log;


public class WidgetHandler extends AbstractHandler {

	Widget widget = new Widget();
	AbstractHandler parent;
	String data;
	String tablename;
	ArrayList<Widget> children = new ArrayList<Widget>();
	
	
	
	@Override
		protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Widget){
			widget.children.add((Widget) exp);
		}
		else if(exp instanceof Event){
			Event event = (Event) exp;
			event.target = attributes.get("id");
			this.widget.events.add(event);
		}
		else if(exp instanceof AbstractCondition){
				this.widget.properties.put("data_exp", (AbstractCondition)exp);
				Log.finer("put data_exp: " + exp.toString());
		}
		else
			throw new SAXException("this is not event element:" + exp);

		}
	
	
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void endElement(String uri, String localName, String qName) throws SAXException{
		Log.fine("\t\tWidget Handler endElement: " + qName);
		
		widget.id = (String) attributes.get("id");
		widget.type = elementName;
		
				
		HashMap<String, Object> props = (HashMap) attributes;
		widget.properties.putAll(props);
		setExpression(widget);

		super.endElement(uri, localName, qName);
	}
	
	
	

	public String toString(){
		return "WidgetHandler";
	}
}
