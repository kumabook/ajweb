package ajweb.utils;

import java.util.HashMap;
import java.util.Iterator;

import ajweb.db.Condition;

public class JSON {
	public static String toString(HashMap<String, ?> map){
		String json = "{";
		Iterator<String> ite = map.keySet().iterator();
		
		while(ite.hasNext()){
			 String key = ite.next();
			 
			 json += key + " : " + map.get(key).toString();
			 
			 
			if(ite.hasNext())
				json += ",";
		}
		return json + "}";
		
	}
	
	public static String toStringCon(HashMap<String, Condition> map){
		String json = "{";
		Iterator<String> ite = map.keySet().iterator();
		
		while(ite.hasNext()){
			 String key = ite.next();
			 if(map.get(key) != null)
				 json += key + " : " + map.get(key).toJSON();
			 else
				 json += key + " : null";
			 
			if(ite.hasNext())
				json += ",";
		}
		return json + "}";
		
	}
}
