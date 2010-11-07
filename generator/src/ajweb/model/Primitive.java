package ajweb.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;


public class Primitive implements Parameterable, Expression , ToJSONAble{
	public static Set<String> elements;
	/**
	 * �l�ƂȂ�v�f�̒�`�@
	 */
	static {
		elements = new HashSet<String>();
		//��{�^
		elements.add("int");
		elements.add("string");
		elements.add("boolean");
		elements.add("text");
		elements.add("datetime");
		elements.add("date");
		elements.add("time");
		elements.add("img");
		elements.add("video");
		
	}
	public String type;//�v�f��, �^
	public String value;//literal
	public HashMap<String, String> properties;
	
	public HashMap<String, String> attributes;
	
	public Primitive(String type, String value) {
		this.type = type;
		this.value = value;
	}
	
	public Primitive(String type, HashMap<String, String> properties){
		this.type = type;
		this.properties = properties;
	}
		
	public String toJsCode(){
		
		if(type.equals(("string")) || (type.equals(("text")))){
			return "\"" + value + "\""; 
		}
		else if(type.equals(("int")) || type.equals(("boolean"))){
			return  value; 
		}
		else if(type.equals("datetime")){
			String json ="ajweb.util.Date({";
			Iterator<String>  it = properties.keySet().iterator();
			while(it.hasNext()){
				String key = it.next();
				json += "key: " + properties.get(key);
				if(it.hasNext())
					json += ",";
			}
			return json;
		}
		else if(type.equals("date")){
			return "datetime:";
		}
		else if(type.equals("time")){
			return "datetime:";
		}
		else
			try {
				throw new Exception("unknown value");
			} catch (Exception e) {

				e.printStackTrace();
			}
		return type;
	}

	@Override
	public String toJSON() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public String toString(){
		return value;
	}
}
