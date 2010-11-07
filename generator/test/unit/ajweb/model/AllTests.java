package ajweb.model;

import junit.framework.Test;
import junit.framework.TestSuite;

public class AllTests extends TestSuite{

	public static Test suite() {
		TestSuite suite = new TestSuite(AllTests.class.getName());
		//$JUnit-BEGIN$
		suite.addTestSuite(EventsTest.class);
		suite.addTestSuite(InterfacesTest.class);
		suite.addTestSuite(DatabaseTest.class);
		//$JUnit-END$
		return suite;
	}

}
