package ajweb.model;

import java.util.ArrayList;



@SuppressWarnings("serial")
public class Action extends ArrayList<Flowable> implements Expression{
	public static ArrayList<String> elements = new ArrayList<String>();
	static {
		elements.add("action");
		elements.add("then");
		elements.add("else");
	}
	public String elementName = "action"; // then‚Æelse‚É‚àÄ—˜—p‚·‚é‚½‚ß
	public String jsCode() {
		
		String str = "";
		
		
		return str;
	}
	
	
}
