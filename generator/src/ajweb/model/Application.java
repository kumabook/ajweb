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
	//public String outDir;
	//String workDir = Config.workDir;
		//public ArrayList<Widget> widgets
	
	public ArrayList<Widget> widgets = new ArrayList<Widget>();
	//public ArrayList<Database> dbDatum = new ArrayList<Database>();
	public Databases databases = new Databases();

	public ArrayList<Action> dbActions = new ArrayList<Action>();
	public Events events;
	
	static public ArrayList<String> selecttable = new ArrayList<String>(); 
	
	static public HashMap<String, Condition> pollingList = new HashMap<String, Condition>(); 
	
	static public Boolean isPolling = false;
	
	
	public Application(String appName){
		this.appName = appName;
	}
	public void generate(String outDir) throws FileNotFoundException, UnsupportedEncodingException, IOException {
		Log.logger.fine("----------------------------Applicaiton generate()---------------------------");
		htmlGenerate(outDir);
		cssGenerate(outDir);
		jsGenerate(outDir);
		databaseGenerate(outDir);
		servletGenerate(outDir);
	}
	
	public void htmlGenerate(String outDir) throws FileNotFoundException, UnsupportedEncodingException, IOException{
		Template html_template;
		html_template = new Template("resources/html");
		FileUtils.writeFile(outDir + "/index.html", html_template.source, Config.isOverWrite);
		Log.logger.fine("generate " + outDir + "/index.html");
		if(Config.isStandardOutput)
			System.out.println("generate " + outDir + "/index.html");
	}
	
	public void cssGenerate(String outDir) throws FileNotFoundException, UnsupportedEncodingException, IOException{
		Template css_template;
		css_template = new Template("resources/css");
		FileUtils.writeFile(outDir + "/index.css", css_template.source, Config.isOverWrite);
		Log.logger.fine("generate " + outDir + "/index.css");
		if(Config.isStandardOutput)
			//System.out.println("generate " + workDir + FileUtils.fs + appName + "/index.css");
			System.out.println("generate " + outDir + "/index.css");
	}

	public void jsGenerate(String outDir) throws IOException{
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
				
		EVENTS = events.toJsSource(databases);
		
		js_template.apply("REQUIRE", REQUIRE);
		js_template.apply("DATABASES", DATABASES);
		js_template.apply("INTERFACES", INTERFACES);
		js_template.apply("EVENTS", EVENTS);
//		js_template.apply("ROOTELEMENT", rootElement);
		FileUtils.writeFile(outDir + "/index.js", js_template.source, Config.isOverWrite);
		Log.logger.fine("generate " + outDir + "/index.js");
		if(Config.isStandardOutput)
			System.out.println("generate " + outDir+ "/index.js");
	}
	
	public void databaseGenerate(String outDir) throws FileNotFoundException, UnsupportedEncodingException, IOException{
		String fs = FileUtils.fs;
		for(int i = 0; i < databases.size(); i++){
			FileUtils.writeFile(outDir+ "/WEB-INF"+fs+"src"+fs+"ajweb"+fs +"data"+fs+
					databases.get(i).tablename + ".java", databases.get(i).toJavaSource(), Config.isOverWrite);
			if(Config.isStandardOutput)
				System.out.println("generate "+ outDir + fs+	"WEB-INF" + fs + "src" + fs + "ajweb" + fs + "data" + 
						fs  + databases.get(i).tablename + ".java");			
		}
	}
	
	public void servletGenerate(String outDir) throws IOException{
		//--------------servlet generate---------------------------------
		FileUtils.writeFile(outDir +"/WEB-INF/src/ajweb/servlet/AjWebServlet.java", databases.toServletSource(appName), Config.isOverWrite);
		if(Config.isStandardOutput)
			System.out.println("generate " + outDir + "/WEB-INF/src/ajweb/servlet/AjWebApp.java");
		//--------------listener generate---------------------------------
		FileUtils.writeFile(outDir + "/WEB-INF/src/ajweb/servlet/AjWebListener.java", databases.toListenerSource(), Config.isOverWrite);
		if(Config.isStandardOutput)
			System.out.println("generate " + outDir + "/WEB-INF/src/ajweb/servlet/AjWebLietener.java");
		/*web_xml generate*/
		Template web_xml_template = new Template("resources/web.xml");
		FileUtils.writeFile(outDir +"/WEB-INF/web.xml", web_xml_template.source, Config.isOverWrite);
		if(Config.isStandardOutput)
			System.out.println("generate " + outDir + "/WEB-INF/web.xml");
	}
	
	public String toString(){
		return "Application: " + appName +  "\nwindow: " + widgets + "\ndbDatum: " + databases + 
		"\ndbActions:" + dbActions + "\nevents" + events;
	}
}
