package ajweb.db;



import java.io.File;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashMap;

import junit.framework.TestCase;


import org.junit.After;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Test;

import ajweb.utils.FileUtils;




public class DBAccessTest extends TestCase{

	HashMap<String, String> properties = new HashMap<String,String>();
	{
		properties.put("thread", "string");
		properties.put("message", "string");
		properties.put("user_name", "string");
		properties.put("posted", "datetime");
	}
	static DBAccess da = new DBAccess("org.apache.derby.jdbc.EmbeddedDriver",
				"jdbc:derby:ajweb_test");
	
	@Before
	public void setUp() throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
		try {
			da.drop("test");
		} catch (SQLException e){
			
		}
		try {
			da.drop("create_test");
		} catch (SQLException e){
			
		}
		da.create("test", properties);
		
	}
	
	@After
	public void tearDown() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		da.drop("test");
	}
	@AfterClass
	static public void AfterClass(){
		FileUtils.delete(new File("ajweb_test"));
		FileUtils.delete(new File("derby.log"));
	}
	@Test
	public void testCreate() throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
						
		HashMap<String, String> properties = new HashMap<String,String>();
		properties.put("thread", "string");
		properties.put("message", "string");
		properties.put("user_name", "string");
		properties.put("posted", "datetime");
		
		da.create("create_test", properties);
		
		//ìØÇ∂ÉeÅ[ÉvÉãÇÕï°êîçÏÇÍÇ»Ç¢
		try {
			da.create("create_test", properties);
			fail("cannot create same name table");
		} catch (SQLException e){
			da.drop("create_test");
			//OK
		}
		
		
	}
	@Test
	public void testDrop() throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
		
		da.create("drop_table", properties);
		
		da.drop("drop_table");
		
		//ë∂ç›ÇµÇ»Ç¢ÉeÅ[ÉuÉãÇÕçÌèúÇ≈Ç´Ç»Ç¢
		try {
			da.drop("exist_table");
			fail("cannot drop unexist table");
		} catch (SQLException e){
			//OK
		}
		
	}
	
	@Test
	public void testInsert() throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
		
				
		HashMap<String, String> param = new HashMap<String, String>();
		param.put("thread", "test_thread");
		param.put("message", "hello ajweb!");
		param.put("user_name", "åFñ{ç_ãI");
		param.put("posted", new Timestamp(System.currentTimeMillis()).toString());
		
		da.insert("test", properties, param);
		
		HashMap<String, String> result = da.select("test", properties, null).get(0);
		assertEquals(param.get("thread"), result.get("thread"));
		assertEquals(param.get("message"), result.get("message"));
		assertEquals(param.get("user_name"), result.get("user_name"));
		assertEquals(param.get("posted"), result.get("posted"));
		
		param.remove("thread");
		try{
			da.insert("test", properties, param);
			fail("cannot insert bad schema");
			} catch (SQLException e){
				//OK
			}
		
	}
	@Test
	public void testDelete() throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
			
		HashMap<String, String> param = new HashMap<String, String>();
		param.put("thread", "test_thread");
		param.put("message", "hello ajweb!");
		param.put("user_name", "åFñ{ç_ãI");
		param.put("posted", new Timestamp(System.currentTimeMillis()).toString());
		
		HashMap<String, String> result = da.insert("test", properties, param);
		da.delete("test", new Condition("eq", "id", result.get("id")));
//		System.out.println("_id " + result.get("id"));
		assertEquals(0, da.select("test", properties, null).size());

		
	}
	
	@Test
	public void testUpdate() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		HashMap<String, String> param = new HashMap<String, String>();
		param.put("thread", "test_thread");
		param.put("message", "hello ajweb!");
		param.put("user_name", "åFñ{ç_ãI");
		param.put("posted", new Timestamp(System.currentTimeMillis()).toString());
		
		da.insert("test", properties, param);
		
		param.put("message", "update_test!");
		da.update("test", properties, param);
		
		HashMap<String, String> result = da.select("test", properties, null).get(0);
		assertEquals(param.get("thread"), result.get("thread"));
		assertEquals(param.get("message"), result.get("message"));
		assertEquals(param.get("user_name"), result.get("user_name"));
		assertEquals(param.get("posted"), result.get("posted"));
	}
	//selectÇÃÉeÉXÉgÇÕConditionTestì‡Ç≈

}
