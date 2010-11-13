package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;

@SuppressWarnings("serial")
public class Events extends ArrayList<Event> implements Expression{
	
	public String toJsSource(Databases databases) throws IOException{
		String jsSource = "";
		for(int i = 0; i < size(); i++){
			jsSource += get(i).toJsSource(databases);
		}
		return jsSource;
	}
}
