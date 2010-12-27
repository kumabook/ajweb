package ajweb.parser;

import java.util.ArrayList;

import org.xml.sax.SAXException;

import ajweb.model.AbstractModel;
import ajweb.model.Get;
import ajweb.model.Param;
import ajweb.model.Parameterable;
import ajweb.model.ReceivedItem;
import ajweb.model.TargetItem;

public class GetHandler extends AbstractHandler{
	AbstractModel get;
	ArrayList<Param> params = new ArrayList<Param>();
	Parameterable param;
	
	
	
	@Override
	protected void addModel(AbstractModel model) throws SAXException {
		if(model instanceof Param){
			params.add((Param) model); 
		}
		else if(model instanceof Parameterable){
			param = (Parameterable) model;
		}
	}
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		String property = attributes.get("property");
		String getter = qName;// + property.substring(0, 1).toUpperCase() + property.substring(1);
		if(qName.equals("get")){
			get = new Get(attributes.get("element"), getter, property, params);
		}
		else if(qName.equals("value")){
			if(attributes.get("type").equals("targetItem")){
				get = new TargetItem(params);
			}
			else if(attributes.get("type").equals("receivedItem")){
				get = new ReceivedItem(params);
			}
			else if(attributes.containsKey("element")){//if(attributes.get("type").equals("element")){
				String func = attributes.get("func"); 
				get = new Get(attributes.get("element"), "", func, params);
			}
		}
		else if(qName.equals("select")){
			get = new Get(attributes.get("database"), "select", property, params);
		}
		else if(qName.equals("selectById")){
			get = new Get(attributes.get("database"), "selectById", property, param);
		}
		else if(qName.equals("selectByCondition")){
			get = new Get(attributes.get("database"), "selectByCondition", property, param);
		}
		else if(qName.equals("targetItem")){
			if(property == null)
				property = "";
			get = new TargetItem(property);
		}
		else if(qName.equals("receivedItem")){
			get = new ReceivedItem(property);
		}
		else if(qName.equals("math")){
		//‚Ü‚¾–¢ŽÀ‘•	
		}
		else if(qName.equals("concat")){
			get = new Get("ajweb.data.String", "concat", property, params);
		}
		setModel(get);
		super.endElement(uri, localName, qName);
	}
}
