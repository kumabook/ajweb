package ajweb.parser;

import java.util.ArrayList;
import org.xml.sax.SAXException;
import ajweb.model.Call;
import ajweb.model.AbstractModel;
import ajweb.model.Param;
import ajweb.model.Parameterable;

public class CallHandler extends AbstractHandler{
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
	
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Call call;
		
		if(qName.equals("call")){
			if(params.size() != 0)
				call = new Call(attributes.get("element"), attributes.get("func"), params);
			else if(param != null)
				call = new Call(attributes.get("element"), attributes.get("func"), param);
			else 
				call = new Call(attributes.get("element"), attributes.get("func"));
		}
		else/* if(qName.equals("insert") || qName.equals("update") || qName.equals("delete"))*/{
			call = new Call(attributes.get("database"), elementName, params);
			call.isCallback = true;
		}
		
		setModel(call);
		super.endElement(uri, localName, qName);
	}
	
	
	public String toString() {
		return "ActionHandler";
	}
}
