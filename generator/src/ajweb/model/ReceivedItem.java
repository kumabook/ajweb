package ajweb.model;

public class ReceivedItem implements Parameterable, Expression {
	public String property;
	
	public ReceivedItem(String property){
		this.property = property;
	}
	@Override
	public String toJsSource(Flowable func, String key, Action rest) {
		if(this.property==null)
			return "targetItem" ;
		else
			return "targetItem." + this.property ;
	}
	@Override
	public boolean isSelect() {
		return false;
	}
}
