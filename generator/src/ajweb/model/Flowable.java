package ajweb.model;

import java.io.IOException;

public interface Flowable {
	abstract public String toJsSource(Flowable func, String key, Action rest) throws IOException;
	abstract public boolean isCallback();
}
