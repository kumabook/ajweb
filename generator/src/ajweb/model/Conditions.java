package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;

import ajweb.utils.Template;

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
	public String toJsSource(Flowable func, String key, Action rest) throws IOException {
		Template conditions_template = new Template("js/conditions");
		
		if(operator.equals("and") || operator.equals("or")){
			conditions_template.apply("OP", operator);
			conditions_template.apply("LEFT", children.get(0).toJsSource(func, key, rest));
			conditions_template.apply("RIGHT", children.get(1).toJsSource(func, key, rest));
		}
		else if(operator.equals("not")){
			conditions_template.apply("OP", operator);
			conditions_template.apply("OPERATOR", children.get(0).toJsSource(func, key, rest));
		}
		return conditions_template.source;
/*		String jsSource = "ajweb.data.Conditions({op:\"" + operator + "\"";
		if(operator.equals("and") || operator.equals("or")){
			jsSource += ", left: " + children.get(0).toJsSource(next) + ", right: " + children.get(1).toJsSource(next);  
		}
		else if(operator.equals("not")){
			jsSource += ", operand: " + children.get(0).toJsSource(next);  
		}
		jsSource += "}";
				
		return jsSource;*/
	}

	@Override
	public String toJsPollingCondition(String database, Flowable func, String key, Action rest) throws IOException {
		Template conditions_template = new Template("js/conditions");
		
		if(operator.equals("and") || operator.equals("or")){
			conditions_template.apply("OP", operator);
			conditions_template.apply("LEFT", children.get(0).toJsPollingCondition(database, func, key, rest));
			conditions_template.apply("RIGHT", children.get(1).toJsPollingCondition(database, func, key, rest));
		}
		else if(operator.equals("not")){
			conditions_template.apply("OP", operator);
			conditions_template.apply("OPERATOR", children.get(0).toJsPollingCondition(database, func, key, rest));
		}
		return conditions_template.source;
	}

	@Override
	public boolean isContainCallback() {
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
