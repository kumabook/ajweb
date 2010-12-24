package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;

public class TargetItem implements Parameterable, AbstractModel{
	public String property;
	private ArrayList<Param> params;
	

	public TargetItem(String property){
		this.property = property;
	}
	
	public TargetItem(ArrayList<Param> params) {
		this.params = params;
	}
	
	@Override
	public String toJsSource(Flowable func, String key, Action rest) throws IOException {
		if(this.property != null)
			return "new ajweb.data.Item({ property: \"" + this.property + "\"});";
		else{
			if(params != null){
				Primitive property_name = (Primitive) this.params.get(0).value;
				return "new ajweb.data.Item({ property: \"" + property_name + "\"});";
			}
			else
				return "new ajweb.data.Item({});";	
		}
	}
	
	@Override
	public boolean isContainCallback() {
		return false;
	}
	@Override
	public String toJavaSource() {
		//現時点ではサーバ側では使わない
		return null;
	}
	@Override
	public String toJavaSource(String string) {
		// TODO Auto-generated method stub
		return null;
	}
}

