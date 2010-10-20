package ajweb.parser;

import junit.framework.Test;
import junit.framework.TestSuite;

public class AllTests extends TestSuite{

	public static Test suite() {
		TestSuite suite = new TestSuite(AllTests.class.getName());
		//$JUnit-BEGIN$
		suite.addTestSuite(InterfacesHandlerTest.class);
		suite.addTestSuite(DatabasesHandlerTest.class);
		suite.addTestSuite(EventsHandlerTest.class);
		//$JUnit-END$
		return suite;
	}

}
