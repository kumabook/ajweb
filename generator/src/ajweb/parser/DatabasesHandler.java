package ajweb.parser;

import org.xml.sax.SAXException;
import ajweb.model.Database;
import ajweb.model.Databases;
import ajweb.model.Expression;

public class DatabasesHandler extends AbstractHandler {
	Databases databases = new Databases();
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Database)
			databases.add((Database) exp);
		else 
			super.addExpression(exp);
	}
	
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		setExpression(databases);
		super.endElement(uri, localName, qName);
	}
	
	public String toString(){
		return "DataBasesDataHandler";
	}
}
