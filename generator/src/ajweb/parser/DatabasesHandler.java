package ajweb.parser;


import java.util.HashMap;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import ajweb.model.Database;
import ajweb.model.Databases;
import ajweb.utils.Log;

public class DatabasesHandler extends AbstractHandler {
	Databases databases = new Databases();
	
	String name;
	String dbDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	String dbName = "jdbc:derby:AJWEB";
		
	HashMap<String, String> properties = new HashMap<String, String>();
		
	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) throws SAXException {
		Log.fine("\t" + this + " start " + "  uri: " + uri + "element :" + qName);
		
		if(qName.equals("database")){
			name = attrs.getValue("id");
		}
		super.initialize(reader, this.parent, attrs, qName);
	}
	
	
	
	@SuppressWarnings("unchecked")
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("\t" + this + " end " + "  uri: " + uri + "element :" + qName);
		
		if(qName == "databases"){
			setExpression(databases);
			//System.out.println(databases);
			super.endElement(uri, localName, qName);
		}
		else if(qName == "database"){
			Database dbData = new Database(name, dbDriver, dbName);
			dbData.properties = (HashMap<String, String>) properties.clone();
			databases.add(dbData);
		}
		
		else if(qName == "property"){
			properties.put(attributes.get("name"), attributes.get("type"));
		}
		
	}
	
	public String toString(){
		return "DataBasesDataHandler";
	}
}
