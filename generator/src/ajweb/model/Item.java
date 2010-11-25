package ajweb.model;

import java.util.ArrayList;
import java.util.HashMap;

@SuppressWarnings("serial")
public class Item extends ArrayList<Param> implements AbstractModel{
	public String toJsonJavaSource(HashMap<String, String> properties){
		String json = "{";
		for(int i  = 0; i < size(); i++){
			if(i != 0)
				json += ",";
			json += " \\\\\\\\\"" + get(i).key + "\\\\\\\\\": " + get(i).value.toJavaSource(properties.get(get(i).key));
		}
		json += "}";
		return json;
	}
}
