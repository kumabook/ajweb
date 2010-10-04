package ajweb.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;


public class Primitive implements Expression , ToJSONAble{
	static Set<String> elements;
	/**
	 * 基本型の定義　子要素をもたない
	 * int
	 * string
	 * 
	 * 
	 * date
	 * datetime
	 * 
	 * var 
	 * get
	 * set
	 */
	static {
	
		elements = new HashSet<String>();
//		elements.add("input");
		elements.add("int");
		elements.add("string");
		elements.add("date");
		elements.add("datetime");
		
		elements.add("value");
		elements.add("property");
		elements.add("binding");
		//elements.add("th");
		
	}
	public String type;
	public String value;
	
	public HashMap<String, String> attributes;
	
	public Primitive(String type, String value) {
		this.type = type;
		this.value = value;
	}
	
	public static boolean isElement(String qName) {

		return elements.contains(qName);
	}
	
	public String toString(){
//		return "\"" + type + ":" + value + attributes + "\"";
		
		if(type.equals(("string"))){
			return "\"" + value + "\""; 
		}
		else if(type.equals(("int"))){
			return "\"" + value + "\""; 
		}
		else if(type.equals(("value"))){
			if(attributes.containsKey("property"))//属性を持っているか
				return attributes.get("element") + "." + attributes.get("property");
			else
				return attributes.get("element");
		} else if(type.equals(("var"))){//変数を宣言
			return "var " + value + ";\n";
		} else
			try {
				throw new Exception("unknown value");
			} catch (Exception e) {

				e.printStackTrace();
			}
		return type;
		
		
	}
	public String toJSON(){
		if(type.equals(("string"))){
			return "\"" + value + "\""; 
		}
		else if(type.equals(("int"))){
			return  value  ; 
		}
		else if(type.equals(("value"))){//変数の値をゲット
			if(attributes.containsKey("property"))//属性を持っているか
				return attributes.get("element") + "." + attributes.get("property");
			else
				return attributes.get("element");
		} else
			try {
				throw new Exception("unknown value");
			} catch (Exception e) {
				e.printStackTrace();
			}
		return type;
	}
	
}
