package ajweb.model;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

public class Hash implements Expression , ToJSONAble{
	public HashMap<String, ToJSONAble> hash;
	
	
	public String toJSON(){
		String result = "{ \n";
		
		Iterator<Entry<String, ToJSONAble>> ite = hash.entrySet().iterator();
		while(ite.hasNext()){
			
			Entry<String, ToJSONAble> property = ite.next();
			result +=  "\t " + property.getKey() + " : " + property.getValue().toJSON();
			if(ite.hasNext())
				result += ",\n";
									
		}
		result += "\t\n}";
		return result;
	}
}
