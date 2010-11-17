package ajweb.model;

import java.io.IOException;
import ajweb.utils.Template;



public class Event implements Expression{
	String id;
	public String type;
	//public String element;
	public String target;
	public AbstractCondition condition;
	public Action action;
	
	public Event(){
		
	}
	public void generate() {

		
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
	public String toJsSource(Databases databases) throws IOException {
		String ACTION = action.toJsSource(null, null, null);
		
		Template event_tempate = new Template("js/event");
		event_tempate.apply("TARGET", target);
		String onType = "on" + type.substring(0, 1).toUpperCase() + type.substring(1);//1•¶Žš–Ú‚ð‘å•¶Žš‚É‚µ‚Äon‚ð‚Â‚¯‚é
		event_tempate.apply("TYPE", onType);
		event_tempate.apply("ACTION", ACTION);
		if(condition != null)
			event_tempate.apply("CONDITION", condition.toJsSource(null, null, null));
		else 
			event_tempate.apply("CONDITION", "true");
		
		String polling_condiitons = "";
		for(int i = 0; i < databases.size(); i++){
			if(target.equals(databases.get(i).id)){
				Template condition_template = new Template("js/addCondition");
				
				condition_template.apply("DATABASE", databases.get(i).id);
				condition_template.apply("CONDITION", condition.toJsPollingCondition(databases.get(i).id, null, polling_condiitons, action));
//				condition_template.apply("CONDITION", condition.toJsSource(null, null, null));
				
				polling_condiitons += "\n\t\t" + condition_template.source;

			}
		}
		
		
		CallBackItems._count = 0;
		return event_tempate.source + polling_condiitons; 
	}
}
