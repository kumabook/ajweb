package ajweb.model;

import java.io.IOException;

import ajweb.utils.Template;



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
		Template branch_template = new Template("js/branch");
		branch_template.apply("CONDITION", condition.toJsSource(func, key, rest));
		branch_template.apply("THEN", truePath.toJsSource(func, key, rest));
		branch_template.apply("ELSE", falsePath.toJsSource(func, key, rest));
		return branch_template.source;
	}


	public boolean isCallback() {
		boolean flag = false;
		flag = condition.isContainCallback();
		for(int i = 0; i < truePath.size(); i++){
			flag = flag || truePath.get(i).isCallback();
		}
		for(int i = 0; i < falsePath.size(); i++){
			flag = flag || falsePath.get(i).isCallback();
		}
		return flag;
	}
}
