package ajweb.parser;


import org.xml.sax.SAXException;

import ajweb.model.Action;
import ajweb.model.AbstractModel;
import ajweb.model.Flowable;
import ajweb.utils.Log;


public class ActionHandler extends AbstractHandler {
	Action action = new Action();
	
	protected void addModel(AbstractModel model) throws SAXException {
		Log.fine("addExpression  action "  + model  + "  " + this);
		if(model instanceof Flowable){
			action.add((Flowable) model);
		}
	}
	
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		action.elementName = elementName;//action then else ‚ð‹æ•Ê
		setModel(action);
		super.endElement(uri, localName, qName);
	}
	
		public String toString() {
		return "ActionHandler";
	}
}
