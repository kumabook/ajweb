package ajweb.model;

import java.util.ArrayList;

public class Get implements Parameterable, Expression{

	public static ArrayList<String> elements = new ArrayList<String>();
	static {
		elements.add("get");
		elements.add("select");
		elements.add("selectById");
		elements.add("selectByCondition");
		
		//�Z�p�v�Z
		elements.add("math");
		//elements.add("");
		
		elements.add("targetItem");//�֐��ł͂Ȃ��������ɋL�q
		elements.add("receivedItem");//�֐��ł͂Ȃ��������ɋL�q
		
	}
	public String element;
	public String getter;
	
	public Get(String element, String getter){
		this.element = element;
		this.getter = getter;
	}

	@Override
	public String toJsCode() {
		// TODO Auto-generated method stub
		return null;
	}
}
