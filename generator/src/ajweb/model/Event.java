package ajweb.model;



public class Event implements Expression{
	String id;
	public String type;
	//public String element;
	public String target;
	public Action action;
	
	public Event(){
		
	}
	public void generate() {
		// TODO Auto-generated method stub
		
	}
	@Override
	public String toString() {
	
		return "e[" + target + ":" + type + "," + action;
	}
	public String jsCode() {
		
		String js = "\tdojo.connect(" + target + ".widget, \"" + type + "\", null, function(){\n";
		
		//for(Action action : actions){
//			js += action.jsCode();
		//}
		return js + "\t});\n";
		
	}
}
