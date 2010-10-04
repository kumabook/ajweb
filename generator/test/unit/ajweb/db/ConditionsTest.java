package ajweb.db;

import static org.junit.Assert.*;

import java.io.File;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashMap;

import org.junit.*;

import ajweb.utils.FileUtils;

public class ConditionsTest {

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
		param.put("user_name", "åFñ{ç_ãI");
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
	public void testAndSQL() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		Condition eq = new Condition("eq", "user_name", "åFñ{ç_ãI");
		String now = new Timestamp(System.currentTimeMillis()).toString();
		Condition gt = new Condition("gt", "posted", now);
		
		Conditions and = new Conditions("AND");
		and.add(eq);
		and.add(gt);
		assertEquals("(user_name = ? AND posted > ?)", and.toPreparedSQL());
		
		assertEquals(0, da.select("test",  properties, and).size());
		
		Condition lt = new Condition("lt", "posted", now);
		Conditions and2 = new Conditions("AND");
		and2.add(eq);
		and2.add(lt);
		
		assertEquals("(user_name = ? AND posted < ?)", and2.toPreparedSQL());
		
		HashMap<String, String> and2_result = da.select("test", properties, and2).get(0);
		assertEquals(param.get("thread"), and2_result.get("thread"));
		assertEquals(param.get("message"), and2_result.get("message"));
		assertEquals(param.get("user_name"), and2_result.get("user_name"));
		assertEquals(param.get("posted"), and2_result.get("posted"));		
	}
	
	@Test
	public void testOrSQL() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		Condition eq = new Condition("eq", "user_name", "åFñ{ç_ãI");
		String now = new Timestamp(System.currentTimeMillis()).toString();
		Condition gt = new Condition("gt", "posted", now);
		
		Conditions or = new Conditions("OR");
		or.add(eq);
		or.add(gt);
		assertEquals("(user_name = ? OR posted > ?)", or.toPreparedSQL());
		
		HashMap<String, String> or_result = da.select("test", properties, or).get(0);
		assertEquals(param.get("thread"), or_result.get("thread"));
		assertEquals(param.get("message"), or_result.get("message"));
		assertEquals(param.get("user_name"), or_result.get("user_name"));
		assertEquals(param.get("posted"), or_result.get("posted"));		
				
	}
		
	@Test
	public void notSQL(){
		
	
	}
	
	@Test
	public void complexSQL() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		Condition eq = new Condition("eq", "user_name", "åFñ{ç_ãI");
		String now = new Timestamp(System.currentTimeMillis()).toString();
		Condition gt = new Condition("gt", "posted", now);
		
		Conditions and = new Conditions("AND");
		and.add(eq);
		and.add(gt);

				
		Conditions or = new Conditions("OR");
		or.add(eq);
		or.add(gt);
		
		and.add(or);
		assertEquals(0, da.select("test",  properties, and).size());
	}
}
