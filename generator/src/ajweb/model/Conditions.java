package ajweb.model;

import java.util.ArrayList;

public class Conditions extends AbstractCondition{
	public ArrayList<AbstractCondition> children;
	public String operator;
	
	public Conditions(String operator){
		this.operator = operator;
	}
	
	public void add(AbstractCondition child){
		this.children.add(child);
	}

	@Override
	public String toJsCode() {
		String jsCode = "ajweb.data.Conditions({op:\"" + operator + "\"";
		if(operator.equals("and") || operator.equals("or")){
			jsCode += ", left: " + children.get(0).toJsCode() + ", right: " + children.get(1).toJsCode();  
		}
		else if(operator.equals("not")){
			jsCode += ", left: " + children.get(0).toJsCode();  
		}
		jsCode += "}";
				
		return jsCode;
	}
	
	
}
