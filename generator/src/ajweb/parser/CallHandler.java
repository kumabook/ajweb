package ajweb.parser;

import java.util.ArrayList;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import ajweb.model.Call;
import ajweb.model.Expression;
import ajweb.model.Param;
import ajweb.utils.Log;

public class CallHandler extends AbstractHandler{
	Call call;
	ArrayList<Param> params = new ArrayList<Param>();
	
	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) throws SAXException {
		Log.fine("\t Call handler start" + qName);
		super.startElement(uri, localName, qName, attrs);
	}
	
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
			call = new Call();
			call.element = attributes.get("element");
			call.func = attributes.get("func");
			call.params = params;
			
			
			setExpression(call);
			super.endElement(uri, localName, qName);
		}
	}
	
	
	public String toString() {
		return "ActionHandler";
	}
}
