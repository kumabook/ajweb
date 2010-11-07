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
	
	String name;
	String dbDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	String dbName = "jdbc:derby:AJWEB";
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
			name = attrs.getValue("id");
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
			Database database = new Database(name, dbDriver, dbName);
			database.properties = (HashMap<String, String>) properties.clone();
			database.initItem = initItem;
			databases.add(database);
		}
		else if(qName == "property"){
			if(!initFlag)
				properties.put(attributes.get("name"), attributes.get("type"));
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
