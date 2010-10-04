package ajweb.parser;


import java.util.HashMap;


import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

import ajweb.db.Condition;
import ajweb.model.Action;
import ajweb.model.Expression;
import ajweb.model.Primitive;
import ajweb.utils.Log;


public class ActionHandler extends AbstractHandler {
	Action action = new Action();
	HashMap<String, Expression> params = new HashMap<String, Expression>();
	Expression value;
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
		
		if(elementName.equals("action")){
			action.id = attrs.getValue("name");
			action.name = attrs.getValue("name");
			action.type = attrs.getValue("type");
			action.table = attrs.getValue("table");
			
		}
		super.initialize(newReader, initParent, attrs, elementName);		
		
		
	}
	protected void addExpression(Expression exp) throws SAXException {
		Log.fine("addExpression  action "  + exp  + "  " + this);
		if(exp instanceof Primitive)
			value = (Primitive) exp;
		else if(exp instanceof Action){
			value = (Action) exp;
		}
		else if(exp instanceof Condition){
				condition = (Condition) exp;
				action.condition = condition;
		}	
	}

	

	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("\taction handler end " + qName );
		
		if(qName.equals("action")){
			setExpression(action);
			super.endElement(uri, localName, qName);
		}
		else if(qName.equals("param")){
			action.param.put(name, value);
			action.params.add(value);
		}
		
		else 
			super.endElement(uri, localName, qName);
		
	}
	
	
	public String toString() {
		return "ActionHandler";
}
}
