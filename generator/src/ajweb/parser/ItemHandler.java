package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.AbstractModel;
import ajweb.model.Item;
import ajweb.model.Param;

public class ItemHandler extends AbstractHandler{
	Item item = new Item();
	
	@Override
	protected void addModel(AbstractModel model) throws SAXException {
		if(model instanceof Param){
			item.add((Param) model);
		}
		else
			super.addModel(model);		
	}
	
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		setModel(item);
		super.endElement(uri, localName, qName);
	}
}
