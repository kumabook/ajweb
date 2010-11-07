package ajweb.model;



public class Branch implements Expression, Flowable{
	public AbstractCondition condition;
	public Action truePath;
	public Action falsePath;
	
	public Branch(AbstractCondition condition, Action truePath, Action falsePath){
		this.condition = condition;
		this.truePath = truePath;
		this.falsePath = falsePath;
	}
}
