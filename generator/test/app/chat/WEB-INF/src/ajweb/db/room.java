package ajweb.db;


import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;


import ajweb.db.*;



public class room {
	
	static HashMap<String, String> properties = new HashMap<String, String>();
	static {
//	       	properties.put("user_name", "string");
//	       	properties.put("enter_time", "datetime");
			properties.put("name", "string");
//			properties.put("", "string");
	}
	
//	static String dbName = "jdbc:derby:nullderby";
	static String dbName =  "jdbc:derby:" + ".ajweb/" + "derby";
	static String driverClassName = "org.apache.derby.jdbc.EmbeddedDriver";
	static String tableName = "room";
	
	static public DBAccess dbAccess = new DBAccess(driverClassName, dbName);
	

	public static void create() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
//		try {
			dbAccess.create(tableName, properties);
//		} catch (SQLException e) {
//			System.out.println("did not create database " + dbName);
//			e.printStackTrace();
//		} 
	}
	
	public static ArrayList<HashMap<String, String>> select(AbstractCondition where) throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
		try {
			return dbAccess.select(tableName, properties, where);
		} catch (SQLException e) {
			e.printStackTrace();
			dbAccess.create(tableName, properties);
			dbAccess.close();
			System.out.println("table is not exist create table " + tableName);

		}
		return new ArrayList<HashMap<String, String>>();
	}
	
	public static HashMap<String, String> insert(HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		System.out.println(properties);
		HashMap<String, String> result = dbAccess.insert(tableName, properties, param);
		dbAccess.close();
		return result;
	}
	
	public static void delete(AbstractCondition where) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		try{
			dbAccess.delete(tableName, where);
			dbAccess.close();
		} catch (SQLException e) {
			dbAccess.create(tableName, properties);
			System.out.println("table is not exist create table " + tableName);
			e.printStackTrace();
		}
	}
	
	public static void update(HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		try {
			dbAccess.update(tableName, properties, param);
			dbAccess.close();
		} catch (SQLException e) {
			dbAccess.create(tableName, properties);
			System.out.println("table is not exist create table " + tableName);
			e.printStackTrace();
		}	
	}
}
