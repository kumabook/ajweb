package ajweb.data;

import static org.junit.Assert.*;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;

import org.junit.*;

import ajweb.data.AbstractCondition;
import ajweb.data.Condition;
import ajweb.data.Conditions;
import ajweb.data.Sql;
import ajweb.data.Date;
import ajweb.data.Modification;


public class ConditionTest {

	HashMap<String, String> properties = new HashMap<String,String>();
	{
		properties.put("thread", "string");
		properties.put("message", "string");
		properties.put("user_name", "string");
		properties.put("posted", "datetime");
	}
	static Sql da = new Sql("org.apache.derby.jdbc.EmbeddedDriver",
				"jdbc:derby:" + SqlTest.derby_dir + "/test");
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
		try {
			da.drop("test");
		} catch (SQLException e){
			
		}
		da.create("test", properties);
				
		da.insert("test", properties, param);
		
		}	
	
	@After
	public void tearDown() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		da.drop("test");
	}
	/*@AfterClass
	static public void AfterClass(){
		FileUtils.delete(new File(SqlTest.derby_dir + "/test"));
		FileUtils.delete(new File("derby.log"));
	}*/

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
	@Test
	public void testRelated() throws Exception{
		String now = new Date(System.currentTimeMillis()).toString();
		Condition gt = new Condition("gt", "posted", now);
		
		assertTrue(gt.related(Modification.parse("{ \"action\": \"insert\", \"table\": \"chat\", \"param\": " +
											"{ " +
												"\"user_name\": \"kumamoto\"," +
												"\"message\": \"hello\"," +
												"\"room_id\": 1," +
												"\"posted\": \"2011-06-25 10:10:10\"" +
											"}" +
										"}").item, properties));
	}
	
	@Test
	public void test_parse(){
		String condition_json = "{\"op\": \"eq\", \"property\": \"name\", \"value\": \"test\" }";
		Condition condition = (Condition) Condition._parse(condition_json);
		assertEquals(condition.operator, "eq");
		assertEquals(condition.property, "name");
		assertEquals(condition.value, "test");
		
		String and_json = "{\"op\": \"and\", " +
								"\"left\": {\"op\": \"eq\", \"property\": \"name\", \"value\": \"test\" }, " +
								"\"right\": {\"op\": \"eq\", \"property\": \"name\", \"value\": 1 }" +
							"}";
		
		Conditions and = (Conditions) Condition._parse(and_json);
		assertEquals(and.operator, "and");
		Condition left = (Condition) and.children.get(0);
		assertEquals(left.operator, "eq");
		assertEquals(left.property, "name");
		assertEquals(left.value, "test");
		Condition right = (Condition) and.children.get(1);
		assertEquals(right.operator, "eq");
		assertEquals(right.property, "name");
		assertEquals(right.value, "1");
	}
	@Test 
	public void testParse(){

		
		String table_conditions_json = "{" +
				"\"room\": " +
					"[" +
						"{\"op\": \"eq\", \"property\": \"name\", \"value\": \"test\" }" +
						"{\"op\": \"eq\", \"property\": \"name\", \"value\": 1 }" +
					"]," +
				"\"chat\": " +
					"[" +
						"{\"op\": \"and\", " +
							"\"left\": {\"op\": \"eq\", \"property\": \"name\", \"value\": \"test\" }, " +
							"\"right\": {\"op\": \"eq\", \"property\": \"name\", \"value\": 1 }" +
						"}" +
					"]" +
				"}";
		
		HashMap<String, ArrayList<AbstractCondition>> tableConditions = Condition.parse(table_conditions_json);
		ArrayList<AbstractCondition> roomConditions = tableConditions.get("room");
		assertEquals(roomConditions.size(), 2);
		Condition condition1 = (Condition) roomConditions.get(0);
		Condition condition2 = (Condition) roomConditions.get(1);
		assertEquals(condition1.operator, "eq");
		assertEquals(condition1.property, "name");
		assertEquals(condition1.value, "test");
		assertEquals(condition2.operator, "eq");
		assertEquals(condition2.property, "name");
		assertEquals(condition2.value, "1");
		
		
		
		ArrayList<AbstractCondition> chatConditions = tableConditions.get("chat");
		
		assertEquals(chatConditions.size(), 1);
		Conditions and = (Conditions) chatConditions.get(0);
		assertEquals(and.operator, "and");
		Condition left = (Condition) and.children.get(0);
		assertEquals(left.operator, "eq");
		assertEquals(left.property, "name");
		assertEquals(left.value, "test");
		Condition right = (Condition) and.children.get(1);
		assertEquals(right.operator, "eq");
		assertEquals(right.property, "name");
		assertEquals(right.value, "1");
	}
	
}
