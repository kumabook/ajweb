package ajweb.parser;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({
	InterfacesHandlerTest.class,
	DatabasesHandlerTest.class,
	EventsHandlerTest.class
})
public class AllTests {}
