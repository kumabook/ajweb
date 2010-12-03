package ajweb.model;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import ajweb.Config;
import ajweb.JarClassLoader;
import ajweb.utils.FileUtils;
import ajweb.utils.Log;
import ajweb.utils.Template;

public class Application implements AbstractModel{
	public String rootElement = "root";//application rootid 属性を参照
	public String appName = "default";
	
	public ArrayList<Widget> widgets = new ArrayList<Widget>();
	public Databases databases = new Databases();
	public Events events;
	
	public Application(String appName, Widget widget, Databases databases,Events events){
		this.appName = appName;
		this.widgets.add(widget);
		this.databases = databases;
		this.events = events;
	}
	public void generate(String outDir) throws FileNotFoundException, UnsupportedEncodingException, IOException {
		Log.logger.fine("----------------------------Applicaiton generate()---------------------------");
		htmlGenerate(outDir);
		cssGenerate(outDir);
		jsGenerate(outDir);
		databaseGenerate(outDir);
		servletGenerate(outDir);
	}
	 
	/**
	 * 作業ディレクトリの作成、ライブラリのコピー 
	 * @param outDir
	 * @throws UnsupportedEncodingException
	 * @throws IOException
	 */
	public void setup(String outDir) throws UnsupportedEncodingException, IOException {
		//System.out.println(new File(".ajweb/test.txt").createNewFile());
		FileUtils.mkdir(outDir);
		FileUtils.mkdir(outDir + "/WEB-INF");
		FileUtils.mkdir(outDir + "/WEB-INF/classes");
		FileUtils.mkdir(outDir + "/WEB-INF/src");
		FileUtils.mkdir(outDir + "/WEB-INF/lib");
		  
		JarClassLoader jcl = new JarClassLoader();
		if(jcl.isLaunchedFromJar()) {			
			String lib_servletDir = "lib/servlet/";
			String web_inf_libDir = outDir + "/WEB-INF/lib/";
			
			FileUtils.copyJar(getClass().getClassLoader().getResource(lib_servletDir + "servlet-api.jar"),   web_inf_libDir + "servlet-api.jar");
			FileUtils.copyJar(getClass().getClassLoader().getResource(lib_servletDir + "servlet-api-2.5.jar"),   web_inf_libDir + "servlet-api-2.5.jar");
			FileUtils.copyJar(getClass().getClassLoader().getResource(lib_servletDir + "derby.jar"),   web_inf_libDir + "derby.jar");
			FileUtils.copyJar(getClass().getClassLoader().getResource(lib_servletDir + "jetty-all-7.0.2.v20100331.jar"),   web_inf_libDir + "jetty-all-7.0.2.v20100331.jar");
		}
		else{
			FileUtils.copyDir(Config.libDir + "/servlet",  outDir + "/WEB-INF/lib/","jar");
		}
				
	}

	public void htmlGenerate(String outDir) throws FileNotFoundException, UnsupportedEncodingException, IOException{
		Template html_template;
		html_template = new Template("resources/html");
		FileUtils.writeFile(outDir + "/index.html", html_template.source, Config.isOverWrite);
		Log.logger.fine("generate " + outDir + "/index.html");
		
		Config.out.println("generate " + outDir + "/index.html");
	}
	
	public void cssGenerate(String outDir) throws FileNotFoundException, UnsupportedEncodingException, IOException{
		Template css_template;
		css_template = new Template("resources/css");
		FileUtils.writeFile(outDir + "/index.css", css_template.source, Config.isOverWrite);
		Log.logger.fine("generate " + outDir + "/index.css");
					//System.out.println("generate " + workDir + FileUtils.fs + appName + "/index.css");
		Config.out.println("generate " + outDir + "/index.css");
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
		interfaces.name = "rootFrame";
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
		Config.out.println("generate " + outDir+ "/index.js");
	}
	
	public void databaseGenerate(String outDir) throws FileNotFoundException, UnsupportedEncodingException, IOException{
		String fs = FileUtils.fs;
		for(int i = 0; i < databases.size(); i++){
			FileUtils.writeFile(outDir+ "/WEB-INF"+fs+"src"+fs+"ajweb"+fs +"data"+fs+
					databases.get(i).tablename + ".java", databases.get(i).toJavaSource(), Config.isOverWrite);
			Config.out.println("generate "+ outDir + fs+	"WEB-INF" + fs + "src" + fs + "ajweb" + fs + "data" + 
						fs  + databases.get(i).tablename + ".java");			
		}
	}
	
	public void servletGenerate(String outDir) throws IOException{

		FileUtils.writeFile(outDir +"/WEB-INF/src/ajweb/servlet/AjWebServlet.java", databases.toServletSource(appName), Config.isOverWrite);
		Config.out.println("generate " + outDir + "/WEB-INF/src/ajweb/servlet/AjWebApp.java");

		FileUtils.writeFile(outDir + "/WEB-INF/src/ajweb/servlet/AjWebListener.java", databases.toListenerSource(), Config.isOverWrite);
		
		Config.out.println("generate " + outDir + "/WEB-INF/src/ajweb/servlet/AjWebLietener.java");
		
		Template web_xml_template = new Template("resources/web.xml");
		FileUtils.writeFile(outDir +"/WEB-INF/web.xml", web_xml_template.source, Config.isOverWrite);
		Config.out.println("generate " + outDir + "/WEB-INF/web.xml");
	}
	
	public String toString(){
		return "[Application: " + appName +  " : " + widgets + " : " + databases + 
		 " : " + events + "]";
	}
}
