package ajweb.data;


import static org.junit.Assert.*;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashMap;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import ajweb.data.Condition;
import ajweb.data.Sql;
import ajweb.Config;

public class SqlTest{
	
	static String derby_dir = Config.test_derby_dir; 

	HashMap<String, String> properties = new HashMap<String,String>();
	{
		properties.put("thread", "string");
		properties.put("message", "string");
		properties.put("user_name", "string");
		properties.put("posted", "datetime");
	}
	static Sql da = new Sql("org.apache.derby.jdbc.EmbeddedDriver",
				"jdbc:derby:" + derby_dir + "/test");
	
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
	/*@AfterClass
	static public void AfterClass(){
		FileUtils.delete(new File(derby_dir + "/test"));
		FileUtils.delete(new File("derby.log"));
	}*/
	@Test
	public void testCreate() throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
						
		HashMap<String, String> properties = new HashMap<String,String>();
		properties.put("thread", "string");
		properties.put("message", "string");
		properties.put("user_name", "string");
		properties.put("posted", "datetime");
		
		da.create("create_test", properties);
		
		//�����e�[�v���͕������Ȃ�
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
		
		//���݂��Ȃ��e�[�u���͍폜�ł��Ȃ�
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
		param.put("user_name", "�F�{�_�I");
		//param.put("posted", "2010-11-13 17:25:25");
		param.put("posted", new Timestamp(System.currentTimeMillis()).toString());
		
		
		da.insert("test", properties, param);
		
		HashMap<String, String> result = da.select("test", properties, null).get(0);
		assertEquals(param.get("thread"), result.get("thread"));
		assertEquals(param.get("message"), result.get("message"));
		assertEquals(param.get("user_name"), result.get("user_name"));
		assertEquals(param.get("posted"), result.get("posted"));
		
		param.remove("thread");
		param.put("room", "test");
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
		param.put("user_name", "�F�{�_�I");
		//param.put("posted", new Timestamp(System.currentTimeMillis()).toString());
		param.put("posted", "2010-11-13 17:25:25");
		
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
		param.put("user_name", "�F�{�_�I");
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

}