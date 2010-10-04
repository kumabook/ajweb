package ajweb.model;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map.Entry;

public class Array implements Expression{
	public ArrayList<ToJSONAble> array = new ArrayList<ToJSONAble>();
	
	public String toJSON(){
		String result = "[ ";
		
		for(int i = 0; i < array.size(); i++){
			
			
			result +=  " " + array.get(i).toJSON();
			if(i != array.size())
					result += ",";
									
		}
		result += "\t\n}";
		return result;
	}

}
