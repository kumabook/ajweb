package ajweb.parser;

import java.util.ArrayList;

import org.xml.sax.SAXException;

import ajweb.model.AbstractModel;
import ajweb.model.Value;
import ajweb.model.Param;
import ajweb.model.Parameterable;
import ajweb.model.ReceivedItem;
import ajweb.model.TargetItem;

public class ValueHandler extends AbstractHandler{
	AbstractModel value;
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
			value = new Value(attributes.get("element"), getter, property, params);
		}
		else if(qName.equals("value")){
			String element = attributes.get("element");
			String func = attributes.get("func");
			String elemType = attributes.get("elemType");
			
			//String funcName = attributes.get("funcName");
	
//			System.out.println(element + " " + funcName + " " + func + " " + property);
			if(property == null)
				property = "";
			//if(func == null || func == "")
//				func = funcName; 
			
			//if(element.equals("receivedItem")){
			if(elemType.equals("receivedItem")){
				if(params.size() > 0)
					value = new ReceivedItem(params.get(0).value.toString());
				else
					value = new ReceivedItem("");
			}
			else //if(element.equals("targetItem")){
				if(elemType.equals("targetItem")){
				if(params.size() > 0)
					value = new TargetItem(params.get(0).value.toString());
				else
					value = new TargetItem("");
			}
			else if(elemType.equals("widget"))	
					value = new Value(element, func, property, params);
			else if(elemType.equals("database"))
					value = new Value(element, func, property, params);
			else if(elemType.equals("data"))
				value = new Value("ajweb."+element, func, property, params);
			else
				System.out.println("------------------------------   " + element + "." +func);
		}
		else if(qName.equals("select")){
			value = new Value(attributes.get("database"), "select", property, params);
		}
		else if(qName.equals("selectById")){
			value = new Value(attributes.get("database"), "selectById", property, param);
		}
		else if(qName.equals("selectByCondition")){
			value = new Value(attributes.get("database"), "selectByCondition", property, param);
		}
		else if(qName.equals("targetItem")){
			if(property == null)
				property = "";
			value = new TargetItem(property);
		}
		else if(qName.equals("receivedItem")){
			value = new ReceivedItem(property);
		}
		else if(qName.equals("math")){
		//‚Ü‚¾–¢ŽÀ‘•	
		}
		else if(qName.equals("concat")){
			value = new Value("ajweb.data.String", "concat", property, params);
		}
		setModel(value);
		super.endElement(uri, localName, qName);
	}
}
