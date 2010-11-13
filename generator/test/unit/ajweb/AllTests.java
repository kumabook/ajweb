package ajweb;

import org.junit.runner.RunWith;

import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({
	ajweb.data.AllTests.class,
	ajweb.parser.AllTests.class, 
	ajweb.model.AllTests.class,
	ajweb.generator.AllTests.class
	})
public class AllTests {}
