package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.AbstractCondition;
import ajweb.model.Action;
import ajweb.model.Event;
import ajweb.model.Expression;
import ajweb.utils.Log;

public class EventHandler extends AbstractHandler {
	Event event;
	Action action = new Action(); 
	AbstractCondition condition;
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Action){
			action = (Action)  exp;
			//System.out.println(action);
		}
		else if(exp instanceof AbstractCondition){
			condition = (AbstractCondition) exp;
		}
	}
	
	public void endElement(String uri, String localName, String qName) throws SAXException{
		Log.fine("\t\tEvent Handler endElement: " + qName);
			
		if(qName.equals("event")){
			//System.out.println("test  " + widget.children.get(0));
			event = new Event();
			event.target = attributes.get("target");
			event.type = attributes.get("type");
			event.action = action;
			event.condition = condition;
			
			this.setExpression(event);
			super.endElement(uri, localName, qName);
			
		}
	}
}
