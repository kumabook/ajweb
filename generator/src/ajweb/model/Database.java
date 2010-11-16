package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;
import org.eclipse.jetty.util.ajax.JSON;
import ajweb.utils.Template;
/**
 * データベーステーブルをあらわすクラス
 * @author hiroki
 *
 */
public class Database implements Expression{
	public String id;
	public String tablename;
	public String dbDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	public String dbName = "jdbc:derby:" + System.getProperty("ajweb.work") + "derby";
	public String type = "server";
	public String persistence = "permanent";
	public HashMap<String, String> properties = new HashMap<String, String>();
	public ArrayList<String> idProperties = new ArrayList<String>();
	public ArrayList<HashMap<String, String>> ref;
	public ArrayList<ArrayList<Param>> initItems;
	

	public Database(String id, String tablename, String dbDriver,String dbName, String type, String persistence, ArrayList<HashMap<String, String>> ref){
		this.id = id;
		this.tablename = tablename;
		this.dbDriver = dbDriver;
		this.dbName = dbName;
		this.type = type;
		this.persistence = persistence;
		this.ref = ref;
	}
	
	/**
	 * AJMLのdbdata要素からデータベース用のjavaコードを生成
	 */
	
	public String toJavaSource() throws IOException{
		
		Iterator<Entry<String, String>> ite = properties.entrySet().iterator();
		String properties_set = "";
		while(ite.hasNext()){//データベースのスキーマ用のコードを生成
			Entry<String, String> property = ite.next();
			if(!property.getValue().equals("ref"))//多対多に対応するなら変更するかも
				properties_set += "\t\tproperties.put(\"" + property.getKey() + "\", \"" + property.getValue() + "\");\n";
		}
		
		
		String id_properties_set = "";
		for(int i = 0; i < idProperties.size(); i++){
			id_properties_set += "\t\tidProperties.add(\"" + idProperties.get(i) + "\");\n";
		}
				
		Template databaseTemplate = new Template("java/database");
		databaseTemplate.apply("TABLENAME", tablename);
//				dbName = Application.appName;
		databaseTemplate.apply("DBNAME", dbName);
		databaseTemplate.apply("DRIVERCLASSNAME", dbDriver);
			
		databaseTemplate.apply("PROPERTIES", properties_set);
		databaseTemplate.apply("IDPROPERTIES", id_properties_set);

		return databaseTemplate.source;
	}
	
	public String toJsSource() throws IOException{
		
		Template tempate;
		if(type.equals("server"))
			tempate = new Template("js/database");
		else 
			tempate = new Template("js/local_database");
		
		tempate.apply("ID", id);
		tempate.apply("TABLENAME", tablename);
		tempate.apply("URL", "dbservlet");
		
		ArrayList<String> properties_list = new ArrayList<String>(); 
		Iterator<String> ite = properties.keySet().iterator();
		while(ite.hasNext()){
			String key = ite.next();
			properties_list.add(key);
		}

		
		tempate.apply("PROPERTIES", JSON.toString(properties));
	
		tempate.apply("PROPERTIES_LIST", JSON.toString(properties_list));
		tempate.apply("PERSISTENCE", persistence);
		tempate.apply("REF", JSON.toString(ref));
		
		return tempate.source;
		/*client のテーブルを定義を定義しているならクライアントテーブルjavaScriptを生成*/
	}
	
	public String toString() {
		return tablename + properties;
	}
}
