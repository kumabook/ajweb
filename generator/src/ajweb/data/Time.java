package ajweb.data;

import java.text.ParseException;
import java.text.SimpleDateFormat;

public class Time {
	public long timestamp;
	private java.util.Date date;
	private SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
	
	public Time(String str) throws ParseException{
		this.date = df.parse("1900-01-01 " + str);
	}
	public Time(long timestamp) {
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
