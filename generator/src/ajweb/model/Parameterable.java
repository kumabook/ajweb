package ajweb.model;

import java.io.IOException;

public interface Parameterable {
	abstract String toJsSource(Flowable func, String key, Action rest) throws IOException;
	abstract boolean isSelect();
}
