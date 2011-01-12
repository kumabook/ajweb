package ajweb.model;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import ajweb.data.Sql;

public class Primitive implements Parameterable, AbstractModel{
	public static Set<String> elements;
	/**
	 * 値となる要素の定義　
	 */
	static {
		elements = new HashSet<String>();
		//基本型
		elements.add("int");
		elements.add("string");
		elements.add("boolean");
		elements.add("text");
		elements.add("datetime");
		elements.add("date");
		elements.add("time");
		elements.add("img");
		elements.add("video");
		
		//他の要素(変数)アクセス用
		elements.add("element");
		
	}
	public String type;//要素名, 型
	public String value;//literal
	public HashMap<String, String> properties;

	
	public Primitive(String type, String value) {
		this.type = type;
		this.value = value;
	}
	
	public Primitive(String type, HashMap<String, String> properties){
		this.type = type;
		this.properties = properties;
	}
		
	public String toJsSource(Flowable func, String key, Action rest){
		
		if(type.equals(("string")) || (type.equals(("text")))){
			return "\"" + value + "\""; 
		}
		else if(type.equals(("int")) || type.equals(("boolean"))){
			return  value; 
		}
		else if(type.equals("datetime")){
			String json ="new ajweb.date({";
			Iterator<String>  it = properties.keySet().iterator();
			while(it.hasNext()){
				String _key = it.next();
				json += _key + ": " + properties.get(_key);
				if(it.hasNext())
					json += ",";
			}
			json += "})";
			return json;
		}
		else if(type.equals("date")){
			String json ="new ajweb.date({";
			Iterator<String>  it = properties.keySet().iterator();
			while(it.hasNext()){
				String _key = it.next();
				json += _key + ": " + properties.get(_key);
				if(it.hasNext())
					json += ",";
			}
			json += "})";
			return json;
		}
		else if(type.equals("time")){
			String json ="new ajweb.date({";
			Iterator<String>  it = properties.keySet().iterator();
			while(it.hasNext()){
				String _key = it.next();
				json += _key + ": " + properties.get(_key);
				if(it.hasNext())
					json += ",";
			}
			json += "})";
			return json;	
		}
		else if(type.equals("element")){
			return value;
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
	public String toString(){
		return value;
	}

	@Override
	public boolean isContainCallback() {
		return false;
	}

	@Override
	public String toJavaSource() {

	if(type.equals(("string")) || (type.equals(("text")))){
		return "\\\\\\\\\"" + value + "\\\\\\\\\""; 
	}
	else if(type.equals(("int")) || type.equals(("boolean"))){
		return  value; 
	}
	else if(type.equals("datetime")){
	
	}
	else if(type.equals("date")){
		return "datetime:";
	}
	else if(type.equals("time")){
		return "datetime:";
	}
	else if(type.equals("password")){
		try {
			return Sql.encryption(value);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}
	
	else
		try {
			throw new Exception("unknown value");
		} catch (Exception e) {

			e.printStackTrace();
		}
	return type;
	}
	
	
	public String toJavaSource(String type) {

	if(type.equals(("string")) || (type.equals(("text")))){
		return "\\\\\\\\\"" + value + "\\\\\\\\\""; 
	}
	else if(type.equals(("int")) || type.equals(("boolean"))){
		return  "\"" + value + "\""; 
	}
	else if(type.equals("datetime")){
	
	}
	else if(type.equals("date")){
		return "datetime:";
	}
	else if(type.equals("time")){
		return "datetime:";
	}
	else if(type.equals("password")){
		try {
			return "\\\\\\\\\"" + Sql.encryption(value) + "\\\\\\\\\"";
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}
	
	else
		try {
			throw new Exception("unknown value");
		} catch (Exception e) {

			e.printStackTrace();
		}
	return type;
	}
}
