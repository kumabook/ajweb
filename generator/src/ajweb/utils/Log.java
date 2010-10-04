package ajweb.utils;

import java.io.File;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class Log {
	public static Logger logger;
	static public String fs = System.getProperty("file.separator");
	static public String ps = System.getProperty("path.separator");
	static {
		File dir = new File("log");
		dir.mkdir();
		logger = Logger.getLogger("ajmlc.loggin");
		FileHandler fh;
		
	try {
		fh = new FileHandler("log" + fs + "ajweb.log");
			fh.setFormatter(new SimpleFormatter(){
			public String format(LogRecord record){
				return record.getLevel() + ": " + record.getMessage() + "\n";
				}
			}
		);
		logger.addHandler(fh);
	} catch (Exception e){
		
	}
		logger.setLevel(Level.FINER);
	
	}
	
	
	static public void log(Level level, String msg){
		logger.log(level, msg);
	}
	
	static public void info(String msg){
		logger.info(msg);
	}
	
	
	static public void fine(String msg){
		logger.fine(msg);
	}
	
	static public void finer(String msg){
		logger.finer(msg);
	}
	
	static public void finest(String msg){
		logger.finest(msg);
	}
	

}
