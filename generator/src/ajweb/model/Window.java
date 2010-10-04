package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import org.eclipse.jetty.util.ajax.JSON;


import ajweb.utils.Template;



public class Window implements Expression{
	public String id;
	public String type;
	public HashMap<String , Object> properties = new HashMap<String, Object>();
	
	public ArrayList<Widget> widgets = new ArrayList<Widget>();
	public ArrayList<Window> containers = new ArrayList<Window>();

	public String default_container;
		
	
	public String jsCode(){
		String js = "\tvar " + id + " = new ajweb.widget." + type + "( " + JSON.toString(properties)  + ");\n" ;
//		"\tdojo.byId(\"ajweb_container\").appendChild(" + id  + ".element);\n";
		
		
//		String js_startup = "\t" + id + ".startup();\n" ;
		
		
		for(int i = 0; i < widgets.size(); i++){
			js += widgets.get(i).jsCode(); 	

			js += "\t" + id + ".add(" + widgets.get(i).id + ");\n";
		}
		
		for(int i = 0; i < containers.size(); i++){
			js += containers.get(i).jsCode();
			js += "\t" + id + ".addPanel(" + containers.get(i).id + ");\n"; // startup()を呼び出すフックを呼ぶ
			if(type.equals("frame")){
				if(default_container.equals(containers.get(i).id)){
					System.out.println("set  default panel " + containers.get(i).id);
					js += "\t" + id + ".setSelectChild(" + default_container + ");";
				}
			}
		}
//		for(int i = 0; i < widgets.size(); i++){
//			js_startup += "\t" + widgets.get(i).id + ".startup();\n";
//		}
		
				
		return js + "\n\n" ;//+ js_startup;
		
	}
	
	public String jsStartup(){
		String js_startup = "";
		//String js_startup = "\t" + id + ".startup();\n" ;
		//js framework側でサポート
//		for(int i = 0; i < widgets.size(); i++){ 
//			js_startup += widgets.get(i).jsStartup();
//		}
		
//		for(int i = 0; i < containers.size(); i++){
//			if(containers.get(i).id.equals(default_container))
//				js_startup +=  containers.get(i).jsStartup();
//		}
		return js_startup;
	}
	
	
	
	public String toString() {
		String str = "[";
		for(int i = 0 ; i < widgets.size(); i++){
			str += widgets.get(i) + ",";
		}
		for(int i = 0 ; i < containers.size(); i++){
			str += containers.get(i) + ",";
		}
		return type + ":" + id + str + "]";
	}
	public HashMap<String, Template> servletCode(
			HashMap<String, Template> servletActionTemplates) throws IOException {
		
		for(Widget widget: widgets){
			servletActionTemplates = widget.servletCode(servletActionTemplates);
		}
		
		for(Window container: containers){
			
			
				servletActionTemplates = container.servletCode(servletActionTemplates);
		}
	
		
		return servletActionTemplates;
	}
	
}
