package ajweb.data;

import java.text.ParseException;
import java.text.SimpleDateFormat;

public class Datetime {
	public long timestamp;
	private java.util.Date date;
	private SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
	
	public Datetime(String str) throws ParseException{
		this.date = df.parse(str);
	}
	public Datetime(long timestamp) {
		this.date = new java.util.Date(timestamp);
	}
	public long getTime(){
		return date.getTime();
	}
	
	@Override
	public String toString() {
		return df.format(date);
	}
}
