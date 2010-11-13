package ajweb.parser;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import ajweb.model.Database;
import ajweb.model.Databases;
import ajweb.model.Expression;
import ajweb.model.Parameterable;
import ajweb.model.Primitive;
import ajweb.utils.Log;

public class DatabasesHandler extends AbstractHandler {
	Databases databases = new Databases();
	
	String id;
	String tablename;
	String dbDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	String dbName = "jdbc:derby:AJWEB";
	String type = "server";
	String persistence = "permanent";
	ArrayList<HashMap<String, String>> ref;
	
	ArrayList<HashMap<String, Parameterable>> initItem;
	HashMap<String, Parameterable> tempItem;
	Parameterable property;
	Boolean initFlag = false;
	String property_name;
			
	HashMap<String, String> properties = new HashMap<String, String>();
		
	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) throws SAXException {
		Log.fine("\t" + this + " start " + "  uri: " + uri + "element :" + qName);
		
		if(qName.equals("database")){
			id = attrs.getValue("id");
			tablename = attrs.getValue("tablename");
			if(tablename == null)
				tablename = attrs.getValue("id");
			if(attrs.getValue("type") != null)
				type = attrs.getValue("type");
			if(attrs.getValue("persistence") != null)
				persistence = attrs.getValue("persistance");
			 ref = new ArrayList<HashMap<String, String>>();
		}
		else if(qName.equals("init")){
			initItem = new ArrayList<HashMap<String, Parameterable>>();
			initFlag = true;
		}
		else if(qName.equals("item")){
			//tempItem = (HashMap<String, String>) attrsToHash(attrs);
			tempItem = new HashMap<String, Parameterable>();
			HashMap<String, String> attributes = attrsToHash(attrs);
			
			Iterator<String> ite = (Iterator<String>) attributes.keySet().iterator();
			while(ite.hasNext()){
				String key = ite.next();
				tempItem.put(key, new Primitive(properties.get(key), attributes.get(key)));
			}
		}
		
		else if(initFlag){
			if(qName.equals("property")){
				HashMap<String, String> attributes = attrsToHash(attrs);
				property_name = attributes.get("name");
			}
			else 
				super.startElement(uri, localName, qName, attrs);
		}
		
		super.initialize(reader, this.parent, attrs, qName);
	}
		
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Parameterable){
			property = (Parameterable) exp;
		}
		else
			super.addExpression(exp);
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
			Database database = new Database(id, tablename, dbDriver, dbName, type, persistence, ref);
			database.properties = (HashMap<String, String>) properties.clone();
			database.initItem = initItem;
			databases.add(database);
		}
		else if(qName == "property"){
			if(!initFlag){
				properties.put(attributes.get("name"), attributes.get("type"));
				if(attributes.get("type").equals("ref")){
					HashMap<String, String> ref_property = new HashMap<String, String>();
					ref_property.put("table", attributes.get("ref"));
					ref_property.put("multiplicity", attributes.get("multiplicity"));
					ref.add(ref_property);
				}
			}
			else {
				tempItem.put(property_name, property);
			}
		}
		else if(qName == "init"){
			initFlag = false;
		}
		else if(qName == "item"){
			initItem.add((HashMap<String, Parameterable>) tempItem.clone());
		}
	}
	
	public String toString(){
		return "DataBasesDataHandler";
	}
}
