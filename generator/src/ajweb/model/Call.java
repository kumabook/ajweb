package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;
import ajweb.utils.Template;

public class Call implements AbstractModel, Flowable{
	public String func;
	public String element;
	public ArrayList<Param> params;
	public Parameterable param;
	public boolean isCallback = false; 
	
	
	public static ArrayList<String> elements = new ArrayList<String>();
	static {
		elements.add("call");
		elements.add("insert");
		elements.add("update");
		elements.add("delete");
		elements.add("login");
		elements.add("check");
	}
	public Call(String element, String func, ArrayList<Param> params){
		this.element = element;
		this.func = func;
		this.params = params;
	}
	public Call(String element, String func, Parameterable param){
		this.element = element;
		this.func = func;
		this.param = param;
	}
	
	public Call(String element, String func){
		this.element = element;
		this.func = func;
	}
	/**
	 * 引数をjson形式の文字列に変換
	 * @param func
	 * @param key
	 * @param rest
	 * @return
	 * @throws IOException
	 */
	public String paramToJsSource(Flowable func, String key, Action rest) throws IOException{
		String json = "{";
		for(int i = 0; i < params.size(); i++){
//			System.out.println(params.get(i).key);
			json += params.get(i).key + ":" + ""+ params.get(i).value.toJsSource(func, key, rest) + "";
			//json += params.get(i).key + ":" + ""+ params.get(i).value.toJsSource(this, params.get(i).key, rest) + "";
			if(i != params.size()-1)
				json += ", ";
		}
		json+= "}";
		return json;
	};
	
	@Override
	public String toJsSource(Flowable function, String key, Action rest) throws IOException{
				//ajweb.utils.JSON.toString(params));
		
		if(isCallback) {//データベースのメソッドだったらコールバックに  rest  を追加する
			for(int i = 0; i < params.size(); i++){
				if(params.get(i).value.isContainCallback()){//select系のコールバックで値を受け取るものがあれば、残りの処理をコールバックで渡す
					Param param = params.remove(i);
					String _key = param.key;
					Value select = (Value) param.value;
					Param callback_param = new Param();
					callback_param.key = _key;
					callback_param.value = new CallBackItems();
					params.add(callback_param);
				
					return select.toJsSource(this, ((CallBackItems) callback_param.value).str, rest);
				}
			}
			
			
			Template call_template = new Template("js/select");
			if(func.equals("login"))
				call_template.apply("DATABASE", "ajweb.data");//ajweb.data.loginを使う
			else 
				call_template.apply("DATABASE", element);
			if(func.equals("delete"))
				call_template.apply("SELECT", "remove");
			else
				call_template.apply("SELECT", func);
			call_template.apply("PARAMS", paramToJsSource(function, key, rest));
			call_template.apply("COUNT", "item");
			call_template.apply("FUNC", "");
			call_template.apply("REST", rest.toJsSource(null, null, null));
			return call_template.source;
		}
		
		Template call_template = new Template("js/call");						
		if(params!=null){
			for(int i = 0; i < params.size(); i++){
				if(params.get(i).value.isContainCallback()){//select系のコールバックで値を受け取るものがあれば、残りの処理をコールバックで渡す
					Param param = params.remove(i);
					String _key = param.key;
					Value select = (Value) param.value;
					Param callback_param = new Param();
					callback_param.key = _key;
					callback_param.value = new CallBackItems();
					params.add(callback_param);
				
					return select.toJsSource(this, ((CallBackItems) callback_param.value).str, rest);
				}
			}
			call_template.apply("PARAMS", paramToJsSource(function, key, rest));
		}
		if(param!=null)
			call_template.apply("PARAMS", param.toJsSource(function, key, rest));
		else
			call_template.apply("PARAMS", "");
		call_template.apply("ELEMENT", element);
		call_template.apply("FUNC", func);

		return call_template.source;
		
	}

	@Override
	public boolean containCallback() {
		return isCallback;
	}
	
	@Override
	public String toString() {
	
		return element + "." + func + "(" + params + ")";
	}
}
