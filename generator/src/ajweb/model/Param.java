package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;


public class Param  implements AbstractModel{
	public String key;
	public Parameterable value;
	
	public Param(){
		
	}

	public Param(String key, Parameterable value){
		this.key = key;
		this.value = value;
	}
	public String toString(Flowable action, String key, Action next) {
		try {
			return key + " : " + value.toJsSource(action, key, next) ;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return key;
	}
	
	static public String paramToJavaSource(ArrayList<Param> params) throws IOException{
		String json = "{";
			for(int i = 0; i < params.size(); i++){
				json += "\\\\\\\\\"" + params.get(i).key + "\\\\\\\\\":" + " " + params.get(i).value.toJavaSource();
				if(i != params.size()-1)
					json += ", ";
				}
				json+= "}";
			return json;
	}
	static public boolean isContainKey(ArrayList<Param> params, String key){
		for(int i = 0; i < params.size(); i ++){
			if(params.get(i).key == key)
				return true;
		}
		return false;
	}
	
	@Override
	public String toString() {
		return key + ":" + value;
	}
	
}
