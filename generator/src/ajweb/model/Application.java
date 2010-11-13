package ajweb.model;


import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;


import java.util.ArrayList;
import java.util.HashMap;

import ajweb.Config;
import ajweb.data.Condition;
import ajweb.utils.FileUtils;
import ajweb.utils.Log;

import ajweb.utils.Template;

public class Application implements Expression{
	public String rootElement = "root";//application rootid ëÆê´ÇéQè∆
	public String appName = "default";
	String workDir = Config.workDir;
		//public ArrayList<Widget> widgets
	
	public ArrayList<Widget> widgets = new ArrayList<Widget>();
	//public ArrayList<Database> dbDatum = new ArrayList<Database>();
	public Databases databases = new Databases();

	public ArrayList<Action> dbActions = new ArrayList<Action>();
	public Events events;
	
	static public ArrayList<String> selecttable = new ArrayList<String>(); 
	
	static public HashMap<String, Condition> pollingList = new HashMap<String, Condition>(); 
	
	static public Boolean isPolling = false;
	
	
	public Application(String appName, String workDirectory){
		this.appName = appName;
		this.workDir = workDirectory;
	}
	public void generate() {
		Log.logger.fine("----------------------------Applicaiton generate()---------------------------");
				
		try {

			htmlGenerate();
			Log.logger.info("generate " + workDir + FileUtils.fs + appName + "/index.html");
			System.out.println("generate " + workDir + FileUtils.fs + appName + "/index.html");
			
			cssGenerate();
			Log.logger.info("generate " + workDir + FileUtils.fs + appName + "/index.css");
			System.out.println("generate " + workDir + FileUtils.fs + appName + "/index.css");
			
			jsGenerate();
			Log.logger.info("generate " + workDir + FileUtils.fs + appName + "/index.js");
			System.out.println("generate " + workDir+ FileUtils.fs + appName + "/index.js");
						
			databases.databaseGenerate(workDir, appName);
						
			databases.servletGenerate(workDir, appName);
		
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	public void htmlGenerate() throws FileNotFoundException, UnsupportedEncodingException, IOException{
		Template html_template;
		html_template = new Template("html/html");
		FileUtils.writeFile(workDir + FileUtils.fs + appName + "/index.html", html_template.source);	
	}
	
	public void cssGenerate() throws FileNotFoundException, UnsupportedEncodingException, IOException{
		Template css_template;
		css_template = new Template("html/css");
		FileUtils.writeFile(workDir +  FileUtils.fs + appName + "/index.css", css_template.source);
	}

	public void jsGenerate() throws IOException{
		Template js_template = new Template("js/js");
		
		String REQUIRE = "";
		String DATABASES = "";
		String INTERFACES = "";
		String EVENTS = "";

		//databases generate
		DATABASES = databases.toJsSource();
		
		//interfaces generate
		
		Widget interfaces = widgets.get(0);
		interfaces.id = "rootFrame";
		HashMap<String ,String> rootProperties = new HashMap<String, String>();
		rootProperties.put("id", "rootFrame");
		rootProperties.put("width", "100%");
		rootProperties.put("height", "100%");
		rootProperties.put("top", "0px");
		rootProperties.put("left", "0px");
		
		
		for(int i = 0; i < interfaces.children.size(); i++){
			INTERFACES += interfaces.children.get(i).toJsSource();
		}
						
		//events generate
				
		events.toJsSource(databases);
		
		

		js_template.apply("REQUIRE", REQUIRE);
		js_template.apply("DATABASES", DATABASES);
		js_template.apply("INTERFACES", INTERFACES);
		js_template.apply("EVENTS", EVENTS);
//		js_template.apply("ROOTELEMENT", rootElement);
		FileUtils.writeFile(workDir + Config.fs +appName + "/index.js", js_template.source);
		Log.fine("create js file");
	}
	
	public void databaseGenerate(){
		databases.databaseGenerate(workDir, appName);
	}
	
	public String toString(){
		return "Application: " + appName +  "\nwindow: " + widgets + "\ndbDatum: " + databases + 
		"\ndbActions:" + dbActions + "\nevents" + events;
	}
}
