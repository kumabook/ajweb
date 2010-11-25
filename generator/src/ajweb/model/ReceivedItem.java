package ajweb.model;

public class ReceivedItem implements Parameterable, AbstractModel {
	public String property;
	
	public ReceivedItem(String property){
		this.property = property;
	}
	@Override
	public String toJsSource(Flowable func, String key, Action rest) {
		if(this.property==null)
			return "receivedItem" ;
		else
			return "receivedItem." + this.property ;
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
