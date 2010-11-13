package ajweb.data;


import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({
	ConditionTest.class,
	ConditionsTest.class,
	SqlTest.class,
	CleanUpDerby.class
})
public class AllTests {}
