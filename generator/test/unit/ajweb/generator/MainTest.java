package ajweb.generator;

import static org.junit.Assert.*;
import java.io.File;
import org.junit.Before;
import org.junit.Test;
import ajweb.utils.FileUtils;

public class MainTest {
	
		
	@Before
	public void setUp() throws InterruptedException{
	
	}
	@Test
	public void testNoOption() throws Exception{
		String[] args  = {"test/ajml/chat.ajml"};
		
		Main.main(args);
		File war = new File("chat.war");
		assertTrue(war.exists());
		
		war.delete();
		
	}
	
	@Test
	public void testWarOption() throws Exception{
		String[] args  = {"test/ajml/chat.ajml", "-war", "test/temp/test.war"};
		
		Main.main(args);
		File war = new File("test/temp/test.war");
		assertTrue(war.exists());
		
		war.delete();
	}
	
	@Test
	public void testSourceOption() throws Exception{
		String[] args  = {"test/ajml/chat.ajml", "-src", "test/temp/main_test_chat"};
		
		Main.main(args);
		File source = new File("test/temp/main_test_chat");
		assertTrue(source.isDirectory());
		assertTrue(source.exists());
		FileUtils.delete(source);
	}

}
