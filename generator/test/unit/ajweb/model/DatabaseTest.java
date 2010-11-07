package ajweb.model;

import java.io.IOException;


import org.junit.Test;
import org.xml.sax.SAXException;

import ajweb.generator.Compiler;
import ajweb.utils.FileUtils;
import ajweb.utils.Template;

import junit.framework.TestCase;


public class DatabaseTest extends TestCase{
	
	@Test
	public void testDatabaseGenerate() throws IOException, SAXException{
		Application app = Compiler.parse("test" + FileUtils.fs + "ajml" +  FileUtils.fs + "databases.ajml");
		//for(int i = 0; i < app.dbDatum.size(); i++){
		
		Databases databases = app.databases;
		Database rooms = databases.get(0);
		
		Template dbTableTemplate = new Template("dbtable");
		dbTableTemplate.apply("TABLENAME", "rooms");
//		dbName = Application.appName;
		dbTableTemplate.apply("DBNAME", "jdbc:derby:" + "AJWEB");
		dbTableTemplate.apply("DRIVERCLASSNAME", "org.apache.derby.jdbc.EmbeddedDriver");
		
		String properties_set = "";
		properties_set += "\t\tproperties.put(\"" + "name" +"\", \"" + "string" + "\");\n";
		
		
		dbTableTemplate.apply("PROPERTIES", properties_set);
		
		//System.out.println(rooms.toJavaSource());
		//System.out.println(dbTableTemplate.source);
		assertEquals(rooms.toJavaSource(), dbTableTemplate.source);
		
		//System.out.println(databases);
	}
}
