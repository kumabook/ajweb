package ajweb.db;

import java.text.ParseException;
import java.text.SimpleDateFormat;

public class Date {
	public long timestamp;
	private java.util.Date date;
	private SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
	
	public Date(String str) throws ParseException{
		this.date = df.parse(str);
	}
	public Date(long timestamp) {
		this.date = new java.util.Date(timestamp);
	}
	public long getTime(){
		return date.getTime();
	}
	
	@Override
	public String toString() {
		//2011-06-25 10:10:10
		return df.format(date);
	}
}
