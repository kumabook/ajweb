package ajweb.jsunit;


import java.sql.SQLException;

import java.util.ArrayList;
import java.util.HashMap;

import ajweb.Config;
import ajweb.data.Sql;
import ajweb.data.AbstractCondition;





public class message {
	
	public static HashMap<String, String> properties = new HashMap<String, String>();
	public static ArrayList<String> idProperties = new ArrayList<String>();
	static {
		properties.put("message", "string");
		properties.put("user_name", "string");
		properties.put("posted", "datetime");
		properties.put("room", "int");
	}
	
	static String dbName = "jdbc:derby:" + Config.workDir + "/chat/derby/";
	static String driverClassName = "org.apache.derby.jdbc.EmbeddedDriver";
	static String tableName = "message";
	
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
	
	public static boolean check(HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		return sql.check(tableName, properties, param);
	}
}

