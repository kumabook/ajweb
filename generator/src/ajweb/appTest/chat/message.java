package ajweb.appTest.chat;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import ajweb.data.AbstractCondition;
import ajweb.data.Sql;

public class message {
	public static HashMap<String, String> properties = new HashMap<String, String>();
	public static ArrayList<String> idProperties = new ArrayList<String>();
	static {
		properties.put("message", "string");
		properties.put("user_name", "string");
		properties.put("posted", "datetime");
		properties.put("room", "int");
	}
	
	static String dbName = "jdbc:sqlite:work/sqlite/AppTestChat";
	static String driverClassName = "org.sqlite.JDBC";
	static String tableName = "message";
	
	static public Sql sql = new Sql(driverClassName, dbName);
	
	
	public static void create() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
	    sql.create(tableName, properties, idProperties);
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
		return sql.delete(tableName, properties, param);
	}
	
	public static boolean delete(AbstractCondition where) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		return sql.delete(tableName, where);
	}
	
	public static HashMap<String, String> update(HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		return sql.update(tableName, properties, param);
	}

	public static boolean check(AbstractCondition con) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		return sql.check(tableName, properties, con);
	}
}
