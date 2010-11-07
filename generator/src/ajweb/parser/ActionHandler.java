package ajweb.parser;


import org.xml.sax.SAXException;

import ajweb.model.Action;
import ajweb.model.Expression;
import ajweb.model.Flowable;
import ajweb.utils.Log;


public class ActionHandler extends AbstractHandler {
	Action action = new Action();
	
	protected void addExpression(Expression exp) throws SAXException {
		Log.fine("addExpression  action "  + exp  + "  " + this);
		if(exp instanceof Flowable){
			action.add((Flowable) exp);
		}
	}
	
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		setExpression(action);
		super.endElement(uri, localName, qName);
	}
	
		public String toString() {
		return "ActionHandler";
	}
}
