package ajweb.parser;

import org.xml.sax.SAXException;
import ajweb.model.Expression;
import ajweb.model.Item;
import ajweb.model.Items;

public class InitHandler extends AbstractHandler{
	Items initItems = new Items();
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Item){
			initItems.add((Item) exp);
		}
		else
			super.addExpression(exp);		
	}
	
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		setExpression(initItems);
		super.endElement(uri, localName, qName);
	}
}
