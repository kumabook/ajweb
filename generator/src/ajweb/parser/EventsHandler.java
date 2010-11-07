package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.Event;
import ajweb.model.Events;
import ajweb.model.Expression;
import ajweb.utils.Log;

public class EventsHandler extends AbstractHandler {
	Events events = new Events();
		
		@Override
		protected void addExpression(Expression exp) throws SAXException {
			Log.fine("addExpression  action to event " + exp);
			//event.actions.add((Action) exp);
			events.add((Event) exp);
		}
		public void endElement(
				String uri, String localName, String qName) throws SAXException{
				Log.fine("\tevent handler end");
				setExpression(events);
				super.endElement(uri, localName, qName);
		}
				
		@Override
		public String toString() {
				return "EventsHandler";
		}
}
