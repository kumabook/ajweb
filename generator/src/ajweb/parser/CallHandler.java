package ajweb.parser;

import java.util.ArrayList;

import org.xml.sax.SAXException;

import ajweb.model.Call;
import ajweb.model.Expression;
import ajweb.model.Param;
import ajweb.model.Parameterable;
import ajweb.utils.Log;

public class CallHandler extends AbstractHandler{
	Call call;
	ArrayList<Param> params = new ArrayList<Param>();
	Parameterable param;
		
	protected void addExpression(Expression exp) throws SAXException {
		Log.fine("addExpression  action "  + exp  + "  " + this);
		
		if(exp instanceof Param){
			params.add((Param) exp);
		}
		else if(exp instanceof Parameterable){
			param = (Parameterable) exp;
		}
			
	}
	
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("\taction handler end " + qName );
		
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
		
		setExpression(call);
		super.endElement(uri, localName, qName);
	}
	
	
	public String toString() {
		return "ActionHandler";
	}
}
