package ajweb.parser;

import java.util.ArrayList;

import org.xml.sax.SAXException;

import ajweb.model.AbstractCondition;
import ajweb.model.Condition;
import ajweb.model.Conditions;
import ajweb.model.AbstractModel;
import ajweb.model.Parameterable;

public class PredicateHandler extends AbstractHandler {
	ArrayList<AbstractCondition> children = new ArrayList<AbstractCondition>();
	ArrayList<Parameterable> operands = new ArrayList<Parameterable>();
	
	@Override
	protected void addModel(AbstractModel model) throws SAXException {
		if(model instanceof AbstractCondition){
			children.add((AbstractCondition) model);
		}
		else if(model instanceof Parameterable){
			operands.add((Parameterable) model);
		}
		else
			super.addModel(model);
	}
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		if(elementName.equals("success")){
			Condition con = new Condition(elementName, attributes.get("func_id"));
			setModel(con);
		}
		else if(elementName.equals("and") || elementName.equals("or") || elementName.contains("not")){
			Conditions con = new Conditions(elementName);
			for(int i = 0; i < children.size(); i++){
				con.add(children.get(i));
			}
			setModel(con);
		}
		else {
			if(operands.size() == 2){
				Condition con = new Condition(elementName, operands.get(0), operands.get(1));
				setModel(con);
			}
		}
		super.endElement(uri, localName, qName);
	}
}
