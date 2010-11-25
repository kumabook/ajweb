package ajweb.parser;

import org.xml.sax.SAXException;
import ajweb.model.AbstractModel;
import ajweb.model.Item;
import ajweb.model.Items;

public class InitHandler extends AbstractHandler{
	Items initItems = new Items();
	
	@Override
	protected void addModel(AbstractModel model) throws SAXException {
		if(model instanceof Item){
			initItems.add((Item) model);
		}
		else
			super.addModel(model);		
	}
	
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		setModel(initItems);
		super.endElement(uri, localName, qName);
	}
}
