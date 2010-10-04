package ajweb.model;


import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import ajweb.utils.FileUtils;
import ajweb.utils.Template;
/**
 * データベーステーブルをあらわすクラス
 * @author hiroki
 *
 */
public class DBData implements Expression{
	public String name;
	public String dbDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	public String dbName = "jdbc:derby:" + System.getProperty("ajweb.work") + "derby";
	public String type = "server";
	public DBData(String name, String dbDriver,String dbName){
		this.name = name;
		this.dbDriver = dbDriver;
		this.dbName = dbName;
	}
	public HashMap<String, String> properties = new HashMap<String, String>();
	/**
	 * AJMLのdbdata要素からデータベース用のjavaコードを生成
	 */
	public void generate(String workDirectory, String appName) {
		String fs = FileUtils.fs;
		//データベースのスキーマを取得
		Iterator<Entry<String, String>> ite = properties.entrySet().iterator();
		String properties_set = "";
		while(ite.hasNext()){
			
			Entry<String, String> property = ite.next();
			properties_set += "\t\tproperties.put(\"" + property.getKey() + "\", \"" + property.getValue() + "\");\n";
			
		}
				
		try {
			Template dbTableTemplate = new Template("dbtable");
			dbTableTemplate.apply("TABLENAME", name);
//			dbName = Application.appName;
			dbTableTemplate.apply("DBNAME", dbName);
			dbTableTemplate.apply("DRIVERCLASSNAME", dbDriver);
			
			dbTableTemplate.apply("PROPERTIES", properties_set);

			//fileに書き出す
			FileUtils.writeFile(workDirectory + fs + appName + fs + "WEB-INF" + fs +"src" + fs + "ajweb" + fs + "db" + fs + name + ".java", dbTableTemplate.source);
			System.out.println("generate " + workDirectory + fs +  appName + fs + 
					"WEB-INF" + fs + "src" + fs + "ajweb" + fs + "db" + 
					fs  + name + ".java");			
		} catch (IOException e) {
			// 
			e.printStackTrace();
		}
		
		/*client のテーブルを定義を定義しているならクライアントテーブルjavaScriptを生成*/
				
	}
	
	public String toString() {
		return name + properties;
	}
}
