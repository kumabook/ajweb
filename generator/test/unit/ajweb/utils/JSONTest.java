package ajweb.utils;



import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import org.junit.After;
import org.junit.Test;

import org.eclipse.jetty.util.ajax.JSON;



public class JSONTest {
		@SuppressWarnings("rawtypes")
		@Test	
	public void testParse() throws IOException {
			String st = "{}";
			HashMap hm = (HashMap) JSON.parse(st);
			System.out.println(hm);
	}
	@After
	public void tearDown() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		
	
	}
}





