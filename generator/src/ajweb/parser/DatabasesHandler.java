package ajweb.parser;

import java.util.HashMap;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import ajweb.model.DBData;
import ajweb.utils.Log;

public class DatabasesHandler extends AbstractHandler {
	String name;
	String type;
	String dbDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	String dbName = "jdbc:derby:AJWEB";
		
	HashMap<String, String> properties;
		
	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) {
		Log.fine("\t" + this + " start " + "  uri: " + uri + "element :" + qName);
		if(qName == "database"){
			name = attrs.getValue("name");
			type = attrs.getValue("type");
			properties = new HashMap<String, String>();
		}
		else if(qName == "observe"){
			//condition handler‚É		
		}
		else if(qName == "property"){
			properties.put(attrs.getValue("name"), attrs.getValue("type"));
		}
	}
	
	public void initialize(XMLReader newReader, AbstractHandler initParent,
			Attributes attrs,String elementName) throws SAXException{
		super.initialize(newReader, initParent, attrs, elementName);
	}
	
	
	@SuppressWarnings("unchecked")
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("\t" + this + " end " + "  uri: " + uri + "element :" + qName);
		
		if(qName == "databases"){
			super.endElement(uri, localName, qName);
		}
		else if(qName == "database"){
			DBData dbData = new DBData(name, dbDriver, dbName);
			if(!(type == null))
				dbData.type = type;
			dbData.properties = (HashMap<String, String>) properties.clone();
			parent.addExpression(dbData);
		}
		else if(qName == "description"){
		}
		else if(qName == "property"){
		}
	}
	
	public String toString(){
		return "DataBasesDataHandler";
	}
}
