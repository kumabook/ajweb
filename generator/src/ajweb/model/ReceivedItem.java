package ajweb.model;

public class ReceivedItem implements Parameterable, Expression {
	public String property;

	public ReceivedItem(String property){
		this.property = property;
	}
	@Override
	public String toJsCode() {
		// TODO Auto-generated method stub
		return null;
	}
}
