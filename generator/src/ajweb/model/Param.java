package ajweb.model;

import java.io.IOException;


public class Param  implements Expression{
	public String key;
	public Parameterable value;
	
	public Param(){
		
	}

	public Param(String key, Parameterable value){
		this.key = key;
		this.value = value;
	}
	public String toString(Flowable action, String key, Action next) {
		try {
			return key + " : " + value.toJsSource(action, key, next) ;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return key;
	}
	@Override
	public String toString() {
		return key + ":" + value;
	}
}
