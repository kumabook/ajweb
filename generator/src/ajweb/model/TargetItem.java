package ajweb.model;

public class TargetItem implements Parameterable, Expression{
	public String property;

	public TargetItem(String property){
		this.property = property;
	}
	@Override
	public String toJsSource(Flowable func, String key, Action rest) {
		return "new ajweb.data.Item({ property: \"" + property + "\"});";
	}
	@Override
	public boolean isSelect() {
		return false;
	}
}

