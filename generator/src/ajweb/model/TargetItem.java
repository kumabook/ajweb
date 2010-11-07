package ajweb.model;

public class TargetItem implements Parameterable, Expression{
	public String property;

	public TargetItem(String property){
		this.property = property;
	}
	@Override
	public String toJsCode() {
		// TODO Auto-generated method stub
		return null;
	}
}

