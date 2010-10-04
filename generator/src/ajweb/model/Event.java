package ajweb.model;

import java.util.ArrayList;

public class Event implements Expression{
	String id;
	String type;
	public String element;
	public ArrayList<Action> actions = new ArrayList<Action>();
	
	public Event(String id, String type){
		this.id = id;
		this.type = type;
	}
	public void generate() {
		// TODO Auto-generated method stub
		
	}
	@Override
	public String toString() {
	
		return "e[" + id + ":" + type + "," + actions;
	}
	public String jsCode() {
		
		String js = "\tdojo.connect(" + element + ".widget, \"" + type + "\", null, function(){\n";
		
		for(Action action : actions){
			js += action.jsCode();
		}
		return js + "\t});\n";
	}
}
