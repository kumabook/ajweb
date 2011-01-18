package ajweb.data;


import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import ajweb.data.Sql;
import ajweb.data.AbstractCondition;




public class room {
	
	public static HashMap<String, String> properties = new HashMap<String, String>();
	public static ArrayList<String> idProperties = new ArrayList<String>();
	static {
		properties.put("name", "string");
	}
	
	static String dbName = "jdbc:derby:work/derby";
	static String driverClassName = "org.apache.derby.jdbc.EmbeddedDriver";
	static String tableName = "room";
	
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
		return sql.delete(tableName, param);
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