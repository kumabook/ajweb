package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;



@SuppressWarnings("serial")
public class Action extends ArrayList<Flowable> implements Expression{
	public static ArrayList<String> elements = new ArrayList<String>();
	static {
		elements.add("action");
		elements.add("then");
		elements.add("else");
	}
	public String elementName = "action"; // thenÇ∆elseÇ…Ç‡çƒóòópÇ∑ÇÈÇΩÇﬂ
	public String toJsSource(Flowable func, String key, Action rest) throws IOException {
		String jsSource = "";
		//if(rest != null)
//			this.addAll(rest);
		
		while(this != null && !this.isEmpty()){
			Flowable action = this.remove(0);
			jsSource += action.toJsSource(func, key, this);
		}
		
		return jsSource;
	}
	
	
}
