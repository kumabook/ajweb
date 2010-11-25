package ajweb.parser;

import org.xml.sax.SAXException;
import ajweb.data.AbstractCondition;
import ajweb.model.Event;
import ajweb.model.AbstractModel;
import ajweb.model.Widget;
import ajweb.utils.Log;

public class InterfacesHandler extends AbstractHandler {
	Widget widget = new Widget();
			
	
	@Override
	protected void addModel(AbstractModel model) throws SAXException {
	if(model instanceof Event){
		Event event = (Event) model;
		event.target = attributes.get("id");
		this.widget.events.add(event);
	}
	else if(model instanceof AbstractCondition){
			this.widget.properties.put("data_exp", (AbstractCondition)model);
			Log.finer("put data_exp: " + model.toString());
	}
	else if(model instanceof Widget)
		this.widget.children.add((Widget) model);
	else 
		super.addModel(model);
	}

	
	public void endElement(String uri, String localName, String qName) throws SAXException{
		widget.name = attributes.get("id");
		widget.type = elementName;
		
		widget.properties.putAll(attributes);
		setModel(widget);
		
		if(qName.equals("interfaces")){
			this.setModel(widget);
			super.endElement(uri, localName, qName);
		}
	}
}
