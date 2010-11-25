package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.AbstractCondition;
import ajweb.model.AbstractModel;
import ajweb.utils.Log;

public class ConditionHandler extends AbstractHandler {
	String property;
	AbstractCondition con;
	
	
	@Override
	protected void addModel(AbstractModel model) throws SAXException {
		if(model instanceof AbstractCondition){
			con = (AbstractCondition) model;
		}
		else 
			super.addModel(model);
	}
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("conditions handler end "  +   qName + "  "  + this);
		setModel(con);
		super.endElement(uri, localName, qName);
	}
	
	@Override
	public String toString() {
		return "ConditionHandler";
	}

}
