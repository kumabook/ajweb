package ajweb.parser;

import org.xml.sax.SAXException;
import ajweb.model.AbstractCondition;
import ajweb.model.Action;
import ajweb.model.Event;
import ajweb.model.AbstractModel;

public class EventHandler extends AbstractHandler {
	Event event;
	Action action = new Action(); 
	AbstractCondition condition;
	
	@Override
	protected void addModel(AbstractModel model) throws SAXException {
		if(model instanceof Action){
			action = (Action)  model;
		}
		else if(model instanceof AbstractCondition){
			condition = (AbstractCondition) model;
		}
	}
	
	public void endElement(String uri, String localName, String qName) throws SAXException{
		if(qName.equals("event")){
			event = new Event(attributes.get("target"), attributes.get("type"), condition, action);
			this.setModel(event);
			super.endElement(uri, localName, qName);
		}
	}
}
