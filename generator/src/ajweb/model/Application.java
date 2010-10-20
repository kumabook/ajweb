package ajweb.model;


import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;



import ajweb.Config;
import ajweb.db.Condition;
import ajweb.utils.FileUtils;
import ajweb.utils.JSON;
import ajweb.utils.Log;

import ajweb.utils.Template;

public class Application implements Expression{
	public String rootElement = "root";//application rootid 属性を参照
	public String appName = "default";
	String workDirectory = Config.workDir;
		//public ArrayList<Widget> widgets
	
	public ArrayList<Widget> widgets = new ArrayList<Widget>();
	//public ArrayList<Database> dbDatum = new ArrayList<Database>();
	public Databases databases = new Databases();

	public ArrayList<Action> dbActions = new ArrayList<Action>();
	public ArrayList<Event> events;
	
	static public ArrayList<String> selecttable = new ArrayList<String>(); 
	
	static public HashMap<String, Condition> pollingList = new HashMap<String, Condition>(); 
	
	static public Boolean isPolling = false;
	
	
	public Application(String appName, String workDirectory){
		this.appName = appName;
		this.workDirectory = workDirectory;
	}
	public void generate() {
		Log.fine("----------------------------Applicaiton generate()---------------------------");
		
		try {

			htmlGenerate();
			System.out.println("generate " + workDirectory + FileUtils.fs + appName + "/index.html");
			
			cssGenerate();
			System.out.println("generate " + workDirectory + FileUtils.fs + appName + "/index.css");
			
			jsGenerate();
			System.out.println("generate " + workDirectory + FileUtils.fs + appName + "/index.js");
						
			dbJavaGenerate();
						
			servletGenerate();
		
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	public void htmlGenerate() throws FileNotFoundException, UnsupportedEncodingException, IOException{
		Template html_template;
		html_template = new Template("html");
		FileUtils.writeFile(workDirectory + FileUtils.fs + appName + "/index.html", html_template.source);	
	}
	
	public void cssGenerate() throws FileNotFoundException, UnsupportedEncodingException, IOException{
		Template css_template;
		css_template = new Template("css");
		FileUtils.writeFile(workDirectory +  FileUtils.fs + appName + "/index.css", css_template.source);
	}

	public void jsGenerate() throws IOException{
		Template js_template = new Template("js");
		
		Log.fine("create js file");
		String js_onload = "";
		String js_startup = "";
//		js_onload +=  "\tajweb.join(\"dbservlet\", " +  JSON.toStringCon(pollingList) + ");\n";
		
		//interfaces generate
		for(int i = 0; i < this.widgets.size(); i++){
			js_onload += this.widgets.get(i).jsCode();
			js_startup += this.widgets.get(i).jsStartup();
		}
		
		//databases generate
		
		
		//events generate
		if(isPolling)
			js_onload +=  "\tajweb.polling(\"dbservlet\", " +  JSON.toStringCon(pollingList) + ");\n";
		
	//	System.out.println("polling list   "  + JSON.toStringCon(pollingList));
		
			//js_onload +=  "\tajweb.join({ url: \"dbservlet\", param: {}});\n" ;
		js_template.apply("ONLOAD", js_onload );
		js_template.apply("STARTUP", js_startup);
		js_template.apply("ROOTELEMENT", rootElement);
		FileUtils.writeFile(workDirectory + Config.fs +appName + "/index.js", js_template.source);
		
	}

	
	public void dbJavaGenerate(){
		for(int i = 0; i < databases.size(); i ++){
			databases.get(i).generate(workDirectory, appName);
		}
	}
	
	public void servletGenerate() throws IOException{
		//--------------servlet generate---------------------------------
		Template servlet_template = new Template("servlet");
		HashMap<String/*action_type*/, Template> servletActionTemplates = new HashMap<String, Template>();
		
		for(int i = 0; i < this.widgets.size(); i++){
			servletActionTemplates.putAll(this.widgets.get(i).servletCode(servletActionTemplates));
		}
		
					
		Iterator<String> ite = servletActionTemplates.keySet().iterator();
		Template actions_template = new Template("actions");
		actions_template.apply("BACK", "");

		while(ite.hasNext()){

			String actionname = ite.next();
			Template action_template = servletActionTemplates.get(actionname);
			action_template.apply("BACK", "");
			//System.out.println("                  " + actionname + "");
			if(!actions_template.isApplied("ACTIONNAME")){
//				System.out.println("                  " + act + "");
				actions_template.apply("ACTIONNAME", actionname);
				actions_template.apply("TABLEACTION", action_template.source);
//				Template actions_template = new Template("actions");
			}
			else {
				Template new_template = new Template("actions");
				new_template.apply("ACTIONNAME", actionname);
				new_template.apply("TABLEACTION", action_template.source);
				new_template.apply("BACK", actions_template.source);
				
				actions_template = new_template;
			}
		}
		
		//select メソッドを設定
		String select_table = "";
		for(String table: selecttable){
			Template select_template = new Template("select");
//			System.out.println("table  " + table);
			select_template.apply("TABLENAME", table);
			select_table += select_template.source;
		}
		
		servlet_template.apply("SELECTTABLE", select_table);
		
		
		servlet_template.apply("ACTIONS", actions_template.source);
//		System.out.println(actions_template.isApplied("ACTIONNAME"));
		if(actions_template.isApplied("ACTIONNAME")){
		FileUtils.writeFile(workDirectory + FileUtils.fs + appName + "/WEB-INF/src/ajweb/servlet/AjWebApp.java", servlet_template.source);
		System.out.println("generate " + workDirectory + FileUtils.fs + appName + "/WEB-INF/src/ajweb/servlet/AjWebApp.java");
		
		
		/*web_xml generate*/
		Template web_xml_template;
			web_xml_template = new Template("web.xml");
			FileUtils.writeFile(workDirectory + FileUtils.fs + appName + "/WEB-INF/web.xml", web_xml_template.source);
			System.out.println("generate " + workDirectory + FileUtils.fs + appName + "/WEB-INF/web.xml");
		}
	}
	
	public String toString(){
		return "Application: " + appName +  "\nwindow: " + widgets + "\ndbDatum: " + databases + 
		"\ndbActions:" + dbActions + "\nevents" + events;
	}
}
