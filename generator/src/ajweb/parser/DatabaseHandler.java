package ajweb.parser;

import java.util.ArrayList;
import java.util.HashMap;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import ajweb.model.Database;
import ajweb.model.Expression;
import ajweb.model.Item;
import ajweb.model.Items;
import ajweb.model.Parameterable;
import ajweb.model.Primitive;


public class DatabaseHandler extends AbstractHandler{
	String id;
	String tablename;
	String dbDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	String dbName = "jdbc:derby:AJWEB";
	String type = "server";
	String persistence = "permanent";
	ArrayList<HashMap<String, String>> ref = new ArrayList<HashMap<String, String>>();
	
	HashMap<String, String> property_attributes;
	
	Items initItems = new Items();;
	Item tempItem;
	Parameterable property;
	Boolean initFlag = false;
	String property_name;
			
	HashMap<String, String> properties = new HashMap<String, String>();
	ArrayList<String> idProperties = new ArrayList<String>();
		
	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) throws SAXException {
		
		if(qName.equals("property")){
			property_attributes = attrsToHash(attrs);
			property_name = property_attributes.get("name");
			property = new Primitive("string", property_attributes.get("value"));
		}
		else
			super.startElement(uri, localName, qName, attrs);
	}
		
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Items){
			initItems = (Items) exp;
		}
		else
			super.addExpression(exp);
	}
	@SuppressWarnings("unchecked")
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		if(qName == "database"){
			
			if(attributes.containsKey("id"))
				id = attributes.get("id"); 
			if(attributes.containsKey("tablename"))
				tablename = attributes.get("tablename"); 
			if(attributes.containsKey("dbDriver"))
				dbDriver = attributes.get("dbDriver"); 
			if(attributes.containsKey("dbName"))
				dbName = attributes.get("dbName"); 
			if(attributes.containsKey("type"))
				 type = attributes.get("type");
			if(attributes.containsKey("persistence"))
				persistence = attributes.get("persistence");
			
			Database database = new Database(id, tablename, dbDriver, dbName, type, persistence, ref);
			database.properties = (HashMap<String, String>) properties.clone();
			database.idProperties = idProperties;
			database.initItems = initItems;

			setExpression(database);
			super.endElement(uri, localName, qName);
		}
		else if(qName == "property"){
			properties.put(property_attributes.get("name"), property_attributes.get("type"));
			if(property_attributes.get("type").equals("ref")){
				HashMap<String, String> ref_property = new HashMap<String, String>();
				ref_property.put("table", property_attributes.get("ref"));
				ref_property.put("multiplicity", property_attributes.get("multiplicity"));
				ref.add(ref_property);
			}
			else if(attributes.containsKey("primary") && attributes.get("primary").equals("true")){
				idProperties.add(attributes.get("name"));
			}
		}
	}
	
	public String toString(){
		return "DataBasesDataHandler";
	}
}