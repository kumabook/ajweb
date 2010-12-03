package ajweb.utils;


import static org.junit.Assert.*;
import java.io.File;
import java.io.IOException;
import java.io.PrintStream;

import org.junit.Test;
import ajweb.Config;

public class FileUtilsTest {
	
	
	
	@Test
	public void testCopy() throws IOException {
		Config.out = new PrintStream("test/temp/test.log");
		String from = "test/file/from";
		String to = "test/file/to";
		String type = "txt";
		FileUtils.copyDir(from, to, type);
//		File to_dir = new File(to);
		File from_dir = new File(from);
		
		File[] from_files = from_dir.listFiles();
		//File[] to_files = to_dir.listFiles();

		//System.out.println("test   " + from_files.length);
		for(int i = 0; i < from_files.length; i++){
			//assertEquals(from_files[i].getName(), to_files[i].getName());
			if(from_files[i].getName().matches(".*\\." + type)){
			//	System.out.println("test   " + from_files[i].getName());
				File file = new File(to + from_files[i].getName());
				assertTrue(file.exists());
				file.delete();
			}
		}
	}
	
	@Test
	public void testRead() throws IOException{
		File readFile = new File("test/file/read/read.txt");
		assertTrue(readFile.exists());
		String test = FileUtils.read(readFile);
		assertEquals("‚±‚ñ‚É‚¿‚Í\nƒnƒ[", test);
	}
}
