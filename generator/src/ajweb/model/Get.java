package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;

import ajweb.utils.Template;

public class Get implements Parameterable, AbstractModel{

	public static ArrayList<String> elements = new ArrayList<String>();
	static {
		elements.add("get");
		elements.add("value");
		elements.add("select");
		elements.add("selectById");
		elements.add("selectByCondition");
		elements.add("selectRefItem");
//		elements.add("login");
//		elements.add("check");
		
		
		//算術計算
		elements.add("math");
		elements.add("concat");
		//elements.add("");
		
		elements.add("targetItem");//関数ではないがここに記述
		elements.add("receivedItem");//関数ではないがここに記述
		
	}
	public String element;
	public String getter;
	public String property;
	public ArrayList<Param> params;
	public Parameterable param;
	
	public Get(String element,String getter, String property, ArrayList<Param> params){
		this.element = element;
		this.getter = getter;
		this.property = property;
		this.params = params;
	}
	public Get(String element,String getter,String property, Parameterable param){
		this.element = element;
		this.getter = getter;
		this.property = property;
		this.param = param;
	}
	public Get(String element,String getter, String property){
		this.element = element;
		this.getter = getter;
		this.property = property;
	}
	
	public String paramToJsSource(Flowable func, String key, Action rest) throws IOException{
		if(this.params==null)
			if(this.param==null)
				return "";
			else {
				return param.toJsSource(func, key, rest);
			}
		else {
			String json = "{ ";
			for(int i = 0; i < params.size(); i++){
			json += params.get(i).key + ":" + " "+ params.get(i).value.toJsSource(func, key, rest) + "";
			if(i != params.size()-1)
				json += ", ";
			}
			json+= "}";
			return json;
		}
	};

	@Override
	public String toJsSource(Flowable func, String key, Action rest) throws IOException {
		String jsSource = "";
		System.out.println("toJsSource" + element + " " + getter + " " + property );
		if(!isContainCallback()){
			
			Template getter_template = new Template("js/getter");
			getter_template.apply("ELEMENT", element);
			
			getter_template.apply("GETTER", getter);
			if(property==null || property == "")//
				property = "";
			else 
				property =  property.substring(0, 1).toUpperCase() + property.substring(1);//1文字目を大文字に
			getter_template.apply("PROPERTY", property);
			getter_template.apply("PARAMS", paramToJsSource(func, key, rest));

			jsSource = getter_template.source.trim();
			
			if(property.equals("Self"))
				jsSource = element;
				
		}
		else {//select系だったらコールバックにfunc({key:items ....};  rest  を追加する
			Template select_template = new Template("js/select");
			select_template.apply("DATABASE", element);
			select_template.apply("SELECT", getter);
			select_template.apply("PARAMS", paramToJsSource(func, key, rest));
			select_template.apply("COUNT", key);
			select_template.apply("FUNC", func.toJsSource(func, key, rest));
			select_template.apply("REST", rest.toJsSource(null, null, null));
			jsSource = select_template.source;
		}
			
		return jsSource;
	}
	
	@Override
	public String toString() {
	
		return "get: " + element	;
	}
	@Override
	public boolean isContainCallback() {
		if(getter.equals("select") || getter.equals("selectById") 
				|| getter.equals("selectByCondition") || getter.equals("selectRefItem") 
					|| getter.equals(("check")) || getter.equals("login"))
			return true;
		else
			return false;
	}
	@Override
	public String toJavaSource() {
		// 現時点ではサーバ側では使わない
		return null;
	}
	@Override
	public String toJavaSource(String string) {
		// TODO Auto-generated method stub
		return null;
	}
}
