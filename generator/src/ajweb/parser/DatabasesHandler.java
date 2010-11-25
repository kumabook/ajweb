package ajweb.parser;

import org.xml.sax.SAXException;
import ajweb.model.Database;
import ajweb.model.Databases;
import ajweb.model.AbstractModel;

public class DatabasesHandler extends AbstractHandler {
	Databases databases = new Databases();
	
	@Override
	protected void addModel(AbstractModel model) throws SAXException {
		if(model instanceof Database)
			databases.add((Database) model);
		else 
			super.addModel(model);
	}
	
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		setModel(databases);
		super.endElement(uri, localName, qName);
	}
	
	public String toString(){
		return "DataBasesDataHandler";
	}
}
