package ajweb.db;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

public class AllTests extends TestSuite{

	public static Test suite() {
		TestSuite suite = new TestSuite(AllTests.class.getName());
		//$JUnit-BEGIN$
		suite.addTestSuite(ConditionsTest.class);
		suite.addTestSuite(ConditionTest.class);
		suite.addTestSuite(DBAccessTest.class);
		//$JUnit-END$
		return suite;
	}

}
