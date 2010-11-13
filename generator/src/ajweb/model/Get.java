package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;

import ajweb.utils.Template;

public class Get implements Parameterable, Expression{

	public static ArrayList<String> elements = new ArrayList<String>();
	static {
		elements.add("get");
		elements.add("select");
		elements.add("selectById");
		elements.add("selectByCondition");
		elements.add("selectRefItem");
		
		//�Z�p�v�Z
		elements.add("math");
		elements.add("concat");
		//elements.add("");
		
		elements.add("targetItem");//�֐��ł͂Ȃ��������ɋL�q
		elements.add("receivedItem");//�֐��ł͂Ȃ��������ɋL�q
		
	}
	public String element;
	public String getter;
	public ArrayList<Param> params;
	public Parameterable param;
	
	public Get(String element, String getter, ArrayList<Param> params){
		this.element = element;
		this.getter = getter;
		this.params = params;
	}
	public Get(String element, String getter, Parameterable param){
		this.element = element;
		this.getter = getter;
		this.param = param;
	}
	
	public String paramToJsSource(Flowable func, String key, Action rest) throws IOException{
		String json = "{";
		for(int i = 0; i < params.size(); i++){
			json += params.get(i).key + ":" + ""+ params.get(i).value.toJsSource(func, key, rest) + "";
			if(i != params.size()-1)
				json += ",";
			else
				json+= "}";
		}
		return json;
	};

	@Override
	public String toJsSource(Flowable func, String key, Action rest) throws IOException {
		String jsSource = "";
		
		if(getter.equals("get")){
			
			Template getter_template = new Template("js/getter");
			getter_template.apply("ELEMENT", element);
			getter_template.apply("GETTER", getter);
			getter_template.apply("PARAMS", paramToJsSource(func, key, rest));
			

			jsSource = getter_template.source;
		}
		else {//select�n��������R�[���o�b�N��func({key:items ....};  rest  ��ǉ�����
			Template select_template = new Template("js/select");
			select_template.apply("DATABASE", element);
			select_template.apply("SELECT", getter);
			select_template.apply("PARAMS", paramToJsSource(func, key, rest));
			
			select_template.apply("COUNT", key);
			
			select_template.apply("FUNC", func.toJsSource(func, key, rest));
			
			select_template.apply("REST", rest.toJsSource(null, null, null));
			jsSource = select_template.source;
			//CallBackItems.count--; //�����̏Փ˂�����邽�߂ɃR�[���o�b�N�̐[�������炷
		}
			
		return jsSource;
	}
	
	@Override
	public String toString() {
	
		return "get: " + element	;
	}
	@Override
	public boolean isSelect() {
		if(getter.equals("select") || getter.equals("selectById") 
				|| getter.equals("selectByCondition") || getter.equals("selectRefItem"))
			return true;
		else
			return false;
	}
}
