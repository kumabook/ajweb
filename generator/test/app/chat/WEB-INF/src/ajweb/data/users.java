package ajweb.data;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import ajweb.Config;

public class users {
	public static HashMap<String, String> properties = new HashMap<String, String>();
	static {
		properties.put("user_id", "string");
		properties.put("password", "string");
		properties.put("role", "string");
	}
	
	static String dbName = "jdbc:derby:" + Config.workDir + "/derby/chat";
	static String driverClassName = "org.apache.derby.jdbc.EmbeddedDriver";
	static String tableName = "users";
	
	static public Sql sql = new Sql(driverClassName, dbName);
	
	
	public static void create() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
	    sql.create(tableName, properties);
	}
	
	public static void drop() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
	    sql.drop(tableName);
	}
	
	public static ArrayList<HashMap<String, String>> select(AbstractCondition where) throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
		return sql.select(tableName, properties, where);
	}
	
	public static HashMap<String, String> insert(HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		return sql.insert(tableName, properties, param);
	}
	
	public static HashMap<String, String> delete(HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		return sql.delete(tableName, param);
	}
	
	public static boolean delete(AbstractCondition where) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		return sql.delete(tableName, where);
	}
	
	public static HashMap<String, String> update(HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		return sql.update(tableName, properties, param);
	}
	
	public static boolean login(String user_id, String password) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		System.out.println(user_id   + "   "  + password);
		HashMap<String, String> param = new HashMap<String, String>();
		param.put("user_id", user_id);
		param.put("password", password);
		return sql.check(tableName, properties, param, "user_id");
	}
}
