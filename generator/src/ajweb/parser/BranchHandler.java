package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.AbstractCondition;
import ajweb.model.Action;
import ajweb.model.Branch;
import ajweb.model.Expression;

public class BranchHandler extends AbstractHandler{
	Branch branch;
	AbstractCondition condition;
	Action truePath = new Action();
	Action falsePath = new Action();
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof AbstractCondition){
			condition = (AbstractCondition) exp;
		}
		else if(exp instanceof Action){
			Action action = (Action) exp;
			if(action.elementName.equals("then")){
				truePath = action;
			}
			else if(action.elementName.equals("else")){
				falsePath = action;
			}
		}
		else 
			super.addExpression(exp);
	}
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		branch = new Branch(condition, truePath, falsePath);
		setExpression(branch);
		super.endElement(uri, localName, qName);
	}
}
