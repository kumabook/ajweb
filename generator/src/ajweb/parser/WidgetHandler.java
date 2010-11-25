package ajweb.parser;

import java.util.ArrayList;
import java.util.HashMap;
import org.xml.sax.SAXException;
import ajweb.data.AbstractCondition;
import ajweb.model.Event;
import ajweb.model.AbstractModel;
import ajweb.model.Widget;
import ajweb.utils.Log;


public class WidgetHandler extends AbstractHandler {
	static HashMap<String, Integer> widgetList = new HashMap<String, Integer>();

	Widget widget = new Widget();
	AbstractHandler parent;
	String data;
	String tablename;
	ArrayList<Widget> children = new ArrayList<Widget>();
	
	
	
	@Override
		protected void addModel(AbstractModel model) throws SAXException {
		if(model instanceof Widget){
			widget.children.add((Widget) model);
		}
		else if(model instanceof Event){
			Event event = (Event) model;
			event.target = attributes.get("id");
			this.widget.events.add(event);
		}
		else if(model instanceof AbstractCondition){
				this.widget.properties.put("data_exp", (AbstractCondition)model);
				Log.finer("put data_exp: " + model.toString());
		}
		else
			super.addModel(model);

		}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void endElement(String uri, String localName, String qName) throws SAXException{

		widget.name = (String) attributes.get("id");
		
		widget.type = elementName;
		if(widget.name == null){
			if(widgetList.get(elementName) == null)
				widgetList.put(elementName, 0);
			int count = widgetList.get(elementName);
			widget.name = elementName + "_" + count++;
			attributes.put("id", widget.name);
			widgetList.put(elementName, count);
		}
		
		HashMap<String, Object> props = (HashMap) attributes;
		widget.properties.putAll(props);
		setModel(widget);

		super.endElement(uri, localName, qName);
	}
	

	public String toString(){
		return "WidgetHandler";
	}
}
