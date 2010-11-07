package ajweb.model;

import java.util.ArrayList;

public class Condition extends AbstractCondition{
	public static ArrayList<String> elements = new ArrayList<String>();
	static {
		elements.add("eq");
		elements.add("neq");
		elements.add("gt");
		elements.add("gte");
		elements.add("lt");
		elements.add("lte");
		elements.add("not");
		elements.add("and");
		elements.add("or");
		
		elements.add("success");
	}

	public String op;
	public Parameterable left;
	public Parameterable right;
	
	public String func_id;
	
	public Condition(String op, Parameterable left, Parameterable right){
		this.op = op;
		this.left = left;
		this.right = right;
	}
	
	public Condition(String op, String func_id){
		this.func_id = func_id;
	}
	
	
	@Override
	public String toJsCode() {
		return "new ajweb.data.Condition(" + op + ")";
	}

}
