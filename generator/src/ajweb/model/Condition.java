package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;

import ajweb.utils.Template;

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
		this.op = op;
		this.func_id = func_id;
	}
	
	
	@Override
	public String toJsSource(Flowable func, String key, Action next) throws IOException {
		if(op.equals("success"))
				return "new ajweb.beforeAction()";
		Template condition_template = new Template("js/condition");
		condition_template.apply("OP", op);
		condition_template.apply("LEFT", left.toJsSource(func, key, next));
		condition_template.apply("RIGHT", "" + right.toJsSource(func, key, next));
		return condition_template.source;
		//return "new ajweb.data.Condition({op: " + op + ", left: " + left.toJsSource(next) +", right: " + right.toJsSource(next)+ "}).evaluete()";
	}

	@Override
	public String toJsPollingCondition(String database, Flowable func, String key, Action rest) throws IOException {
		Template condition_template = new Template("js/polling_condition");
		ReceivedItem receivedItem = (ReceivedItem) left;
		condition_template.apply("OP", op);
		condition_template.apply("DATABASE", database);
		condition_template.apply("PROPERTY", receivedItem.property);
		condition_template.apply("FUNCTION", "" + right.toJsSource(func, key, rest) + "");
		return condition_template.source;
	}

	@Override
	public boolean isSelect() {
		return false;
	}
}
