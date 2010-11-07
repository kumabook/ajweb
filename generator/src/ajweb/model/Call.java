package ajweb.model;

import java.util.ArrayList;

public class Call implements Expression, Flowable{
	public String func;
	public String element;
	public ArrayList<Param> params;
	
	
	public static ArrayList<String> elements = new ArrayList<String>();
	static {
		elements.add("call");
		elements.add("insert");
		elements.add("update");
		elements.add("delete");
	}
	public Call(String element, String func, ArrayList<Param> params){
		this.element = element;
		this.func = func;
		this.params = params;
	}
	
	public String getParamJSON(){
		String json = "{";
		for(int i = 0; i < params.size(); i++){
			json += params.get(i).key + ":" + "\""+ params.get(i).value.toJsCode() + "\"";
			if(i == params.size())
				json += ",";
			else
				json+= "}";
		}
		return json;
	};
	
	public String toJsCode(){
		return elements + "." + func + "(" + getParamJSON() + ")";
	}
	@Override
	public String toString() {
	
		return element + "." + func + "(" + params + ")";
	}
}
