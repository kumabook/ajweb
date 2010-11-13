package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

import ajweb.utils.FileUtils;
import ajweb.utils.Template;

@SuppressWarnings("serial")
public class Databases extends ArrayList<Database> implements Expression{
	//public ArrayList<DBData> datum;
	public void databaseGenerate(String workDirectory, String appName){
		for(int i = 0; i < size(); i ++){
			get(i).databaseGenerate(workDirectory, appName);
		}
	}
	
	public void servletGenerate(String workDirectory, String appName) throws IOException{
		//--------------servlet generate---------------------------------
		FileUtils.writeFile(workDirectory + FileUtils.fs + appName + "/WEB-INF/src/ajweb/servlet/AjWebApp.java", toServletSource(appName));
		System.out.println("generate " + workDirectory + FileUtils.fs + appName + "/WEB-INF/src/ajweb/servlet/AjWebApp.java");
		//--------------listener generate---------------------------------
		FileUtils.writeFile(workDirectory + FileUtils.fs + appName + "/WEB-INF/src/ajweb/servlet/AjWebListener.java", toListenerSource());
		System.out.println("generate " + workDirectory + FileUtils.fs + appName + "/WEB-INF/src/ajweb/servlet/AjWebLietener.java");
		/*web_xml generate*/
		Template web_xml_template = new Template("web.xml");
		FileUtils.writeFile(workDirectory + FileUtils.fs + appName + "/WEB-INF/web.xml", web_xml_template.source);
		System.out.println("generate " + workDirectory + FileUtils.fs + appName + "/WEB-INF/web.xml");
	}

	
	public String toServletSource(String appname) throws IOException{
		Template servlet_template = new Template("java/servlet");
		String SELECT, INSERT, UPDATE, DELETE, GETPROPERITIES;
		SELECT = "";
		INSERT = UPDATE = DELETE = GETPROPERITIES = ";";
		
		
		for(int i = 0; i < size(); i++){
			Template SELECT_TEMP = new Template("java/select");
			SELECT_TEMP.apply("TABLENAME", get(i).tablename);
			SELECT_TEMP.apply("NEXT", SELECT);
			SELECT = SELECT_TEMP.source;
			
			Template INSERT_TEMP = new Template("java/action");
			INSERT_TEMP.apply("TABLENAME", get(i).tablename);
			INSERT_TEMP.apply("ACTIONNAME", "insert");
			INSERT_TEMP.apply("NEXT", INSERT);
			INSERT = INSERT_TEMP.source;
			
			Template UPDATE_TEMP = new Template("java/action");
			UPDATE_TEMP.apply("TABLENAME", get(i).tablename);
			UPDATE_TEMP.apply("ACTIONNAME", "update");
			UPDATE_TEMP.apply("NEXT", UPDATE);
			UPDATE = UPDATE_TEMP.source;
			
			Template DELETE_TEMP = new Template("java/action");
			DELETE_TEMP.apply("TABLENAME", get(i).tablename);
			DELETE_TEMP.apply("ACTIONNAME", "delete");
			DELETE_TEMP.apply("NEXT", DELETE);
			DELETE = DELETE_TEMP.source;
			
			Template GETPROPERITIES_TEMP = new Template("java/getproperties");
			GETPROPERITIES_TEMP.apply("TABLENAME", get(i).tablename);
			GETPROPERITIES_TEMP.apply("NEXT", GETPROPERITIES);
			GETPROPERITIES = GETPROPERITIES_TEMP.source;
			
		}
		servlet_template.apply("SELECT", "\t\t\t\t\t" + SELECT);
		servlet_template.apply("INSERT", "\t\t\t\t\t" + INSERT);
		servlet_template.apply("UPDATE", "\t\t\t\t\t" + UPDATE);
		servlet_template.apply("DELETE", "\t\t\t\t\t" + DELETE);
		servlet_template.apply("GETPROPERTIES", "\t\t" + GETPROPERITIES);
		
		servlet_template.apply("APPNAME", appname);
		
		return servlet_template.source;
	}

		
	public String toListenerSource() throws IOException {
		Template listener_template = new Template("java/listener");
		String CREATE = "";
		for(int i = 0; i < size(); i++){
			Database database = get(i);
			Template create_template = new Template("java/create");
			create_template.apply("TABLENAME", database.tablename);
			String INITIALIZE = "";
			for(int j = 0; j < database.initItem.size(); j++){
				String json = "{";
				Iterator<String> ite = database.initItem.get(j).keySet().iterator();
				while(ite.hasNext()){
					String key = ite.next();
					json += "\\\\\\\\\"" + key + "\\\\\\\\\": \\\\\\\\\"" + database.initItem.get(j).get(key).toString() + "\\\\\\\\\"";
					if(ite.hasNext()) json += ", ";
				}
				json += "}";
				INITIALIZE += "\t\t" + database.tablename + ".insert((HashMap<String, String>) JSON.parse(\"" + json + "\"));\n";	
			}
			
			create_template.apply("INITIALIZE", INITIALIZE);
			CREATE += "\n" + create_template.source;
		}
		listener_template.apply("CREATE", CREATE);
		return listener_template.source;
	}

	public String toJsSource() throws IOException {
		String jsSource = "";
		for(int i = 0; i < size(); i++){
			jsSource += get(i).toJsSource() + "\n";
		}
		return jsSource;
	}
}
