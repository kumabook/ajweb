package ajweb.model;

import java.util.HashMap;


import org.xml.sax.Attributes;

public class WidgetExpression {
	String name;
	HashMap<String, String> attributes = new HashMap<String, String>();
	
	public WidgetExpression(String name, Attributes attrs){
		System.out.println("widget create " + name + " : attrs " + attrs);
		System.out.println(" " + attrs.getValue("id"));
		this.name = name;
		for(int i = 0; i < attrs.getLength(); i++){
			
			System.out.println("widget attri " + attrs.getQName(i) + " " + attrs.getValue(i));
			attributes.put(attrs.getQName(i), attrs.getValue(i));
		}
	}
	
	
	public String toString(){
		return name + attributes;
	}
}
