package ajweb.data;

import java.io.File;

import org.junit.Test;

import ajweb.Config;
import ajweb.utils.FileUtils;

public class CleanUpDerby {
	@Test
	public void cleanUpDerby(){
		FileUtils.delete(new File(Config.test_derby_dir + "/test"));
		FileUtils.delete(new File("derby.log"));
		
	}
}
