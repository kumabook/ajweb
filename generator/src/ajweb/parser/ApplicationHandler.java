package ajweb.parser;

import org.xml.sax.SAXException;
import ajweb.model.Application;
import ajweb.model.Databases;
import ajweb.model.Events;
import ajweb.model.AbstractModel;
import ajweb.model.Widget;

/**
 * ajml ‚Ì applicaitonƒGƒŒƒƒ“ƒgˆ——pHandler 
 * @author hiroki
 *
 */

public class ApplicationHandler extends AbstractHandler {
	Widget widget;
	Databases databases;
	Events events;
	@Override
	protected void addModel(AbstractModel model) throws SAXException {
		if (model instanceof Widget)
			widget = (Widget) model;
		else if (model instanceof Databases){
			databases = (Databases) model;
		}
		else if (model instanceof Events)
			events = (Events) model;
	}
	
	@Override
	public void endElement(
		String uri, String localName, String qName) throws SAXException{
		Application application = new Application(attributes.get("name"), widget, databases, events);
		setModel(application);
		super.endElement(uri, localName, qName);
	}

	public String toString(){
		return "ApplicaitonHandler";
	}
}
