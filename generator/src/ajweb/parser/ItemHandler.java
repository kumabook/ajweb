package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.Expression;
import ajweb.model.Item;
import ajweb.model.Param;

public class ItemHandler extends AbstractHandler{
	Item item = new Item();
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Param){
			item.add((Param) exp);
		}
		else
			super.addExpression(exp);		
	}
	
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		setExpression(item);
		super.endElement(uri, localName, qName);
	}
}
