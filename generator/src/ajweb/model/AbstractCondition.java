package ajweb.model;

import java.io.IOException;

public abstract class AbstractCondition implements Parameterable , Expression{
	abstract public String toJsPollingCondition(String database, Flowable func, String key, Action rest) throws IOException;
}
