package ajweb.parser;

import org.xml.sax.SAXException;
import ajweb.model.Event;
import ajweb.model.Events;
import ajweb.model.AbstractModel;

public class EventsHandler extends AbstractHandler {
	Events events = new Events();
		
		@Override
		protected void addModel(AbstractModel model) throws SAXException {
			if(model instanceof Event)
				events.add((Event) model);
			else 
				super.addModel(model);
		}
		public void endElement(
				String uri, String localName, String qName) throws SAXException{
				setModel(events);
				super.endElement(uri, localName, qName);
		}
				
		@Override
		public String toString() {
				return "EventsHandler";
		}
}
