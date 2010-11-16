package ajweb.generator;




import java.io.File;
import java.sql.SQLException;

import junit.framework.TestCase;

import org.junit.After;
import org.junit.Test;


public class MainTest extends TestCase{
	@Test
	public void testSetup() throws Exception {
		String from = "lib/";
		String to = ".ajweb/chat/WEB-INF/lib/";
		String type = "jar";
		Compiler.setup("test/temp");
		//FileUtils.copyDir(from, to, type);
		//File to_dir = new File(to);
		File from_dir = new File(from);
		
		File[] from_files = from_dir.listFiles();
		//File[] to_files = to_dir.listFiles();

		System.out.println("test   " + from_files.length);
		for(int i = 0; i < from_files.length; i++){
			//assertEquals(from_files[i].getName(), to_files[i].getName());
			if(from_files[i].getName().matches(".*\\." + type)){
				File file = new File(to + from_files[i].getName());
				assertTrue(file.exists());
				//file.delete();
			}
		}
		
	}
	@After
	public void tearDown() throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		
	
	}
}
