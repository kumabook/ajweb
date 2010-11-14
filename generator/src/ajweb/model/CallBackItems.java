package ajweb.model;

import java.io.IOException;

public class CallBackItems implements Parameterable{
	static int _count = 1;
	int count;
	String str;
	
	public CallBackItems(){
		this.count = _count++;
		this.str = "items" + count;
	}
	@Override
	public String toJsSource(Flowable func, String key, Action rest)
			throws IOException {
		return str;
	}

	@Override
	public boolean isSelect() {
		return false;
	}

}
