package ajweb.parser;

import java.util.HashMap;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

import ajweb.model.DBData;
import ajweb.utils.Log;



public class DBDataHandler extends AbstractHandler {
	String name;
	String dbDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	String dbName = "jdbc:derby:AJWEB";
	
	HashMap<String, String> properties = new HashMap<String, String>();
	
	
	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) {
		Log.fine("\t" + this + " start " + "  uri: " + uri + "element :" + qName);
		if(qName == "dbdata"){
			name = attrs.getValue("name");
		}
		else if(qName == "description"){
//			name = attrs.getValue("tablename");
			
		}
		else if(qName == "property"){
			properties.put(attrs.getValue("name"), attrs.getValue("type"));
			
		}
	}
	
	public void initialize(XMLReader newReader, AbstractHandler initParent,
			Attributes attrs,String elementName) throws SAXException{
		
		super.initialize(newReader, initParent, attrs, elementName);
	}
	
	
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("\t" + this + " end " + "  uri: " + uri + "element :" + qName);
		
		if(qName == "dbdata"){
			DBData dbData = new DBData(name, dbDriver, dbName);
			dbData.properties = properties;
			setExpression(dbData);
			super.endElement(uri, localName, qName);
		}
		else if(qName == "description"){
		}
		else if(qName == "property"){
			
		}
	}
	

	
	public String toString(){
		return "DBDataHandler";
	}
}
