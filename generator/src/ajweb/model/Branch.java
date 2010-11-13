package ajweb.model;

import java.io.IOException;



public class Branch implements Expression, Flowable{
	public AbstractCondition condition;
	public Action truePath;
	public Action falsePath;
	
	public Branch(AbstractCondition condition, Action truePath, Action falsePath){
		this.condition = condition;
		this.truePath = truePath;
		this.falsePath = falsePath;
	}

	@Override
	public String toJsSource(Flowable func, String key, Action rest) throws IOException {
		String jsSource = "";
		jsSource += "\t\t\tif(" + condition.toJsSource(func, key, rest) + "){\n\t\t\t";
		jsSource += truePath.toJsSource(func, key, rest);
		jsSource += "\t\t\t\n\t\t\t} \n\t\t\telse {\n\t\t\t " + falsePath.toJsSource(func, key, rest);
		jsSource += "\n\t\t\t}";
		return jsSource;
	}
}
