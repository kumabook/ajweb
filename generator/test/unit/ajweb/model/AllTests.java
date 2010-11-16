package ajweb.model;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({ 
	EventsTest.class, 
	InterfacesTest.class, 
	DatabaseTest.class,
	ApplicationTest.class
	})
public class AllTests {}
