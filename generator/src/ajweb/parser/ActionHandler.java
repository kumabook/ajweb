package ajweb.parser;

import java.util.HashMap;


import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

import ajweb.db.Condition;
import ajweb.model.Action;
import ajweb.model.Call;
import ajweb.model.Expression;
import ajweb.utils.Log;


public class ActionHandler extends AbstractHandler {
	Action action = new Action();
	HashMap<String, Expression> params = new HashMap<String, Expression>();
	
	Condition condition;
	String name;
	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) throws SAXException {
		Log.fine("\t action handler start" + qName);
		if(qName.equals("param")){
			name = attrs.getValue("name");
		}
		else 
			super.startElement(uri, localName, qName, attrs);
	}
	public void initialize(XMLReader newReader, AbstractHandler initParent,
            Attributes attrs,String elementName) throws SAXException {
		super.initialize(newReader, initParent, attrs, elementName);		
		
		
	}
	protected void addExpression(Expression exp) throws SAXException {
		Log.fine("addExpression  action "  + exp  + "  " + this);
		if(exp instanceof Call){
			action.add((Call) exp);
		}
	}

	

	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("\taction handler end " + qName );
		
		if(qName.equals("action")){
			setExpression(action);
			super.endElement(uri, localName, qName);
		}
				
	}
	
	
	public String toString() {
		return "ActionHandler";
}
}
