package ajweb.generator;

import junit.framework.Test;
import junit.framework.TestSuite;

public class AllTests extends TestSuite{

	public static Test suite() {
		TestSuite suite = new TestSuite(AllTests.class.getName());
		//$JUnit-BEGIN$
		suite.addTestSuite(CompilerTest.class);
		suite.addTestSuite(GenerateAppTest.class);
		suite.addTestSuite(HandlerTest.class);
		suite.addTestSuite(MainTest.class);
		//$JUnit-END$
		return suite;
	}

}
