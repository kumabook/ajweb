package ajweb.model;

import java.util.ArrayList;

public class ReceivedItem implements Parameterable, AbstractModel {
	public String property;
	private ArrayList<Param> params;
	
	public ReceivedItem(String property){
		this.property = property;
	}
	public ReceivedItem(ArrayList<Param> params) {
		this.params = params;
	}
	@Override
	public String toJsSource(Flowable func, String key, Action rest) {
		if(this.property==null){
			if(params == null)
				return "receivedItem" ;
			else {
				Primitive property = (Primitive) this.params.get(0).value;
				return "receivedItem." + property.value ;
			}
		}
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
