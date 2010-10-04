package ajweb.db;

import java.util.ArrayList;
import java.util.HashMap;

import org.eclipse.jetty.util.ajax.JSON;

public class Modification {
	public String tablename;
	public String type;
	public HashMap<String, String> item;
	
	public Modification(String tablename, String type, HashMap<String, String> item){
		this.tablename = tablename;
		this.type = type;
		this.item = item;
	}
	
	public static String toJSON(ArrayList<Modification> modifications){
		String result = "[";
		for(int i = 0; i < modifications.size(); i++ ){
			if(i != 0)
				result += ",";
			result += toJSON(modifications.get(i));
			
		}
		return result + "]";
		
	}
	
	public static String toJSON(Modification modification){
		return "{ action : \"" + modification.type + "\" ,table: \"" + modification.tablename + "\", item: " + JSON.toString(modification.item) + "} "; 
	}
}
