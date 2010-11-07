package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import org.eclipse.jetty.util.ajax.JSON;

import ajweb.db.Condition;
import ajweb.utils.Template;

public class Widget implements Expression{
	public String id;
	public String type;
	public ArrayList<Widget> children = new ArrayList<Widget>();
	public ArrayList<Event> events = new ArrayList<Event>();
	public HashMap<String , Object> properties = new HashMap<String, Object>();
	
	public static ArrayList<String> widgets = new ArrayList<String>();
	static {
		widgets.add("button");
		widgets.add("table");
		widgets.add("th");
		widgets.add("label");
		widgets.add("textbox");
		widgets.add("selectbox");
		widgets.add("select");
		widgets.add("panel");
		widgets.add("frame");
	}
	
	
	
	@SuppressWarnings("unchecked")
	public String jsCode(){
		String js_data = "";
		HashMap<String, Object> json_prop = (HashMap<String, Object>) properties.clone();
		json_prop.remove("data_exp");
		json_prop.remove("tablename");
		
		if(properties.containsKey("data")){//data要素を持っていたらajweb.data.storeを作成
			Condition data_exp = (Condition) properties.get("data_exp");
			
			
//			System.out.println(id + data_exp);
			String url = "\"dbservlet\"";
			String condition ;
			String tablename; 
			if(data_exp!=null){
				 condition = data_exp.toJSON();
				 tablename = (String) properties.get("tablename");
			}
			else {
				condition = null;
				tablename = (String) properties.get("data");
				
			}
			//select 可能なtableリストに追加
			Application.selecttable.add(tablename);
			Application.pollingList.put(tablename, data_exp);
			
			String store_id = (String) properties.get("data");
			js_data = "\tvar " + store_id + " = new ajweb.data.store({ id: \"" + store_id  
				+ "\", table: \"" + tablename + "\", url: " +  url + ", param: "
				+ condition + "});\n";
			js_data += "\tajweb.stores.push(" + store_id+  ");\n";

			Application.isPolling = true;
//			 	+ "\tajweb.join(" + url + ", \"" + tablename + "\", " + condition + ");\n";
		}
		
		String js_event = "";
		for(int i = 0; i < events.size(); i++){
			js_event += events.get(i).jsCode();
		}
		
		String js = "\tvar " + id + " = new ajweb.widget." + type
		+ "(" + JSON.toString(json_prop) +	");\n";
		
//		properties.remove("data_exp");
		
		return js_data + js + js_event;
		
	}
	
	public String jsStartup(){
		 
		return "\t" + id + ".startup();\n";
		
	}
	
	@SuppressWarnings("unused")
	public HashMap<String, Template> servletCode(HashMap<String, Template> servletActionTemplates ) throws IOException{
		HashMap<String, Template> results = servletActionTemplates;
		for(int i = 0; i < this.children.size(); i++){
			results = this.children.get(i).servletCode(results);

		}
		
		for(Event event: events){
			//for(Action action : event.action){
				
			/*	if(action.type.equals("db")){
					if(action.name.equals("insert") || action.name.equals("update")){
						Template table_action_template = new Template("tableaction");
						table_action_template.apply("TABLENAME", action.table);
						table_action_template.apply("ACTIONNAME", action.name);
						if(!results.containsKey(action.name)){
							results.put(action.name, table_action_template);
						}
						else {
							table_action_template.apply("BACK", servletActionTemplates.get(action.name).source);
							results.put(action.name, table_action_template);
						}
					}
					else if(action.name.equals("delete") || action.name.equals("select")){
						Template table_action_template = new Template("tableaction_condition");
						table_action_template.apply("TABLENAME", action.table);
						table_action_template.apply("ACTIONNAME", action.name);
						if(!results.containsKey(action.name)){
							results.put(action.name, table_action_template);
						}
						else {
							table_action_template.apply("BACK", servletActionTemplates.get(action.name).source);
							results.put(action.name, table_action_template);
						}
					}
				}*/
			//}
		}
		return servletActionTemplates;
		
	}
	
	
	public String toString() {
		//return type + ":"  + id + events;
		return type + "{"  + "children: " + this.children +  "events: " + this.events + "}";
	}

}
