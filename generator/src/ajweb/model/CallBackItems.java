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
	public boolean isContainCallback() {
		return false;
	}
	@Override
	public String toJavaSource() {
		// �����_�ł̓T�[�o���ł͎g��Ȃ�
		return null;
	}
	@Override
	public String toJavaSource(String string) {
		// TODO Auto-generated method stub
		return null;
	}

}
