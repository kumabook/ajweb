package ajweb.parser;

import org.xml.sax.Attributes;

import org.xml.sax.SAXException;

import ajweb.db.AbstractCondition;
import ajweb.db.Condition;
import ajweb.model.Expression;
import ajweb.model.Primitive;
import ajweb.utils.Log;




public class ConditionHandler extends AbstractHandler {
	AbstractCondition abcon;
	String property;
	Condition con;
	Primitive value;
	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) throws SAXException {
		Log.fine("condisions handler start " + qName + " : " + this);
		
		if(qName.equals("eq")){
			property = attrs.getValue("property");
			
		}
		else 
			super.startElement(uri, localName, qName, attrs);
	}

	@Override
	protected void addExpression(Expression exp) throws SAXException {
		Log.fine("addExpression  " + exp  +  " : " + this);
		value = (Primitive) exp;
		Log.fine("addExpression  con " + value);
	}
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("conditions handler end "  +   qName + "  "  + this);
		
		if(qName.equals("eq")){
			con = new Condition("eq", property, null);
			con.param = value.toJSON();
			setExpression(con);
		}
		else 
			super.endElement(uri, localName, qName);
	}
	
	@Override
	public String toString() {

		return "ConditionHandler";
	}

}
