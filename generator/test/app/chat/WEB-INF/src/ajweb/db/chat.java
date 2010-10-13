package ajweb.db;


import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

public class chat {
	
	static HashMap<String, String> properties = new HashMap<String, String>();
	static {
	    	properties.put("message", "string");
	    	properties.put("user_name", "string");
	    	properties.put("room_id", "int");
	    	properties.put("posted", "datetime");
	}
	
//	static String dbName = "jdbc:derby:nullderby";
	static String dbName =  "jdbc:derby:" + ".ajweb/" + "derby";
	static String driverClassName = "org.apache.derby.jdbc.EmbeddedDriver";
	static String tableName = "chat";
	
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
		System.out.println("select request " + tableName);
			return dbAccess.select(tableName, properties, where);
	}
	
	public static HashMap<String, String> insert(HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
			System.out.println(properties);
			HashMap<String, String> result = dbAccess.insert(tableName, properties, param);
			dbAccess.close();
			return result;
	}
	
	public static void delete(AbstractCondition where) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		
			dbAccess.delete(tableName, where);
			dbAccess.close();
		
	}
	
	public static void update(HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		dbAccess.update(tableName, properties, param);
		dbAccess.close();
	}
	public static void drop() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		dbAccess.drop(tableName);
	}
}
