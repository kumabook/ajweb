package ajweb.parser;

import java.util.ArrayList;

import org.xml.sax.SAXException;

import ajweb.model.AbstractCondition;
import ajweb.model.Condition;
import ajweb.model.Conditions;
import ajweb.model.Expression;
import ajweb.model.Parameterable;

public class PredicateHandler extends AbstractHandler {
	ArrayList<AbstractCondition> children = new ArrayList<AbstractCondition>();
	ArrayList<Parameterable> operands = new ArrayList<Parameterable>();
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof AbstractCondition){
			children.add((AbstractCondition) exp);
		}
		else if(exp instanceof Parameterable){
			operands.add((Parameterable) exp);
		}
		else
			super.addExpression(exp);
	}
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		if(elementName.equals("success")){
			Condition con = new Condition(elementName, attributes.get("func_id"));
			setExpression(con);
		}
		else if(elementName.equals("and") || elementName.equals("or") || elementName.contains("not")){
			Conditions con = new Conditions(elementName);
			for(int i = 0; i < children.size(); i++){
				con.add(children.get(i));
			}
			setExpression(con);
		}
		else {
			Condition con = new Condition(elementName, operands.get(0), operands.get(1));
			setExpression(con);
		}
		super.endElement(uri, localName, qName);
	}
}
