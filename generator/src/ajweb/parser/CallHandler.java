package ajweb.parser;

import java.util.ArrayList;

import org.xml.sax.SAXException;

import ajweb.model.Call;
import ajweb.model.Expression;
import ajweb.model.Param;
import ajweb.utils.Log;

public class CallHandler extends AbstractHandler{
	Call call;
	ArrayList<Param> params = new ArrayList<Param>();
	
		
	protected void addExpression(Expression exp) throws SAXException {
		Log.fine("addExpression  action "  + exp  + "  " + this);
		
		if(exp instanceof Param){
			params.add((Param) exp);
		}
	}
	
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("\taction handler end " + qName );
		
		if(qName.equals("call")){
			call = new Call(attributes.get("element"), attributes.get("func"), params);
		}
		else if(qName.equals("insert") || qName.equals("update") || qName.equals("delete")){
			call = new Call(attributes.get("database"), elementName, params);
		}
		
		setExpression(call);
		super.endElement(uri, localName, qName);
	}
	
	
	public String toString() {
		return "ActionHandler";
	}
}
