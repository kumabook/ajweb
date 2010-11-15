package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;

import ajweb.utils.Template;

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
	
	public String getParamJSON(Flowable func, String key, Action rest) throws IOException{
		String json = "{";
		for(int i = 0; i < params.size(); i++){
			json += params.get(i).key + ":" + "\""+ params.get(i).value.toJsSource(func, key, rest) + "\"";
			if(i != params.size()-1)
				json += ",";
			else
				json+= "}";
		}
		return json;
	};
	public String paramToJsSource(Flowable func, String key, Action rest) throws IOException{
		String json = "{";
		for(int i = 0; i < params.size(); i++){
			json += params.get(i).key + ":" + ""+ params.get(i).value.toJsSource(func, key, rest) + "";
			if(i != params.size()-1)
				json += ", ";
			else
				json+= "}";
		}
		return json;
	};
	
	public String toJsSource(Flowable function, String key, Action rest) throws IOException{
		String jsSource = "";
				//ajweb.utils.JSON.toString(params));
		boolean selectFlag = false;
		for(int i = 0; i < params.size(); i++){
			if(params.get(i).value.isContainCallback()){//select系のコールバックで値を受け取るものがあれば、残りの処理をコールバックで渡す
				Param param = params.remove(i);
				String _key = param.key;
				Get select = (Get) param.value;
				Param callback_param = new Param();
				callback_param.key = _key;
				callback_param.value = new CallBackItems();
				params.add(callback_param);
				
				jsSource += select.toJsSource(this, ((CallBackItems) callback_param.value).str, rest);
				selectFlag = true;
			}
		}
		if(!selectFlag){
			Template call_template = new Template("js/call");
			call_template.apply("ELEMENT", element);
			call_template.apply("FUNC", func);
			call_template.apply("PARAMS", paramToJsSource(function, key, rest));
			jsSource = call_template.source;
		}
		return jsSource;
		
	}
	
	@Override
	public String toString() {
	
		return element + "." + func + "(" + params + ")";
	}
}
