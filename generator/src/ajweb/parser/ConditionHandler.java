package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.AbstractCondition;
import ajweb.model.Expression;
import ajweb.utils.Log;

public class ConditionHandler extends AbstractHandler {
	String property;
	AbstractCondition con;
	
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof AbstractCondition){
			con = (AbstractCondition) exp;
		}
		else 
			super.addExpression(exp);
	}
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("conditions handler end "  +   qName + "  "  + this);
		setExpression(con);
		
		super.endElement(uri, localName, qName);
	}
	
	@Override
	public String toString() {

		return "ConditionHandler";
	}

}
