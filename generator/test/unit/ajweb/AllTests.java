package ajweb;

import junit.framework.Test;
import junit.framework.TestSuite;

public class AllTests {

	public static Test suite() {
		TestSuite suite = new TestSuite(AllTests.class.getName());
		//$JUnit-BEGIN$
		
		suite.addTest(ajweb.db.AllTests.suite());
		suite.addTest(ajweb.parser.AllTests.suite());
		suite.addTest(ajweb.model.AllTests.suite());
		
		//$JUnit-END$
		return suite;
	}

}
