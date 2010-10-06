package ajweb.parser;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

import ajweb.model.Action;
import ajweb.model.Event;
import ajweb.model.Expression;
import ajweb.utils.Log;

public class EventsHandler extends AbstractHandler {
	Event event;
		@Override
		public void startElement(
				String uri, String localName, String qName,
				Attributes attrs) throws SAXException {
			Log.fine("\tevent handler start");
			
			super.startElement(uri, localName, qName, attrs);


		}
		
		public void initialize(XMLReader newReader, AbstractHandler initParent,
			Attributes attrs,String elementName) throws SAXException {
			super.initialize(newReader, initParent, attrs, elementName);
			event = new Event((String)attributes.get("id"), (String) attributes.get("type"));

		}
		
		@Override
		protected void addExpression(Expression exp) throws SAXException {
			Log.fine("addExpression  action to event " + exp);
			event.actions.add((Action) exp);
		}
		public void endElement(
				String uri, String localName, String qName) throws SAXException{
				Log.fine("\tevent handler end");
				//setExpression
				setExpression(event);
				super.endElement(uri, localName, qName);
		}
		

		
		@Override
		public String toString() {
				return "EventHandler";
		}
}
