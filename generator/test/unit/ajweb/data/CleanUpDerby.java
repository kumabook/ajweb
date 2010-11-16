package ajweb.data;

import java.io.File;
import org.junit.Test;
import ajweb.utils.FileUtils;

public class CleanUpDerby {
	@Test
	public void cleanUpDerby(){
		FileUtils.delete(new File(SqlTest.derby_dir + SqlTest.appName));
		FileUtils.delete(new File("derby.log"));
		
	}
}
