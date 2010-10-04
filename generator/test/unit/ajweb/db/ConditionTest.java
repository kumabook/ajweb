
package ajweb.db;

import static org.junit.Assert.*;

import java.io.File;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashMap;

import org.junit.*;

import ajweb.utils.FileUtils;

public class ConditionTest {

	HashMap<String, String> properties = new HashMap<String,String>();
	{
		properties.put("thread", "string");
		properties.put("message", "string");
		properties.put("user_name", "string");
		properties.put("posted", "datetime");
	}
	static DBAccess da = new DBAccess("org.apache.derby.jdbc.EmbeddedDriver",
				"jdbc:derby:ajweb_test");
	static HashMap<String, String> param;
	{
		param = new HashMap<String, String>();
		param.put("thread", "test_thread");
		param.put("message", "hello ajweb!");
		param.put("user_name", "ŒF–{_‹I");
		param.put("posted", new Timestamp(System.currentTimeMillis()).toString());

	}
	
	@Before
	public void setUp() throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
		da.create("test", properties);
				
		da.insert("test", properties, param);
		
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
	public void testPreparedSQL() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		Condition eq = new Condition("eq", "user_name", "ŒF–{_‹I");
		assertEquals("user_name = ?", eq.toPreparedSQL());
		
		String now = new Timestamp(System.currentTimeMillis()).toString();
		Condition gt = new Condition("gt", "posted", now);
		assertEquals("posted > ?", gt.toPreparedSQL());
		
		Condition lt = new Condition("lt", "posted", now);
		assertEquals("posted < ?", lt.toPreparedSQL());
		
		HashMap<String, String> eq_result = da.select("test", properties, eq).get(0); 
		assertEquals(param.get("thread"), eq_result.get("thread"));
		assertEquals(param.get("message"), eq_result.get("message"));
		assertEquals(param.get("user_name"), eq_result.get("user_name"));
		assertEquals(param.get("posted"), eq_result.get("posted"));		
		
		assertEquals(0, da.select("test",  properties, gt).size());
		
		HashMap<String, String> lt_result = da.select("test", properties, lt).get(0);
		assertEquals(param.get("thread"), lt_result.get("thread"));
		assertEquals(param.get("message"), lt_result.get("message"));
		assertEquals(param.get("user_name"), lt_result.get("user_name"));
		assertEquals(param.get("posted"), lt_result.get("posted"));		
		
	}
	
}
