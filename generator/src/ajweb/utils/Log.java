package ajweb.utils;

import java.io.File;
import java.io.IOException;

import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

import ajweb.Config;

public class Log {
	public static Logger logger = Logger.getLogger("ajweb.generator");
	//public static Logger generatorLogger = Logger.getLogger("ajweb.");
	public static Logger serverLogger = Logger.getLogger("ajweb.server");
	public static Logger servletLogger = Logger.getLogger("ajweb.servlet");
	static public String fs = System.getProperty("file.separator");
	static public String ps = System.getProperty("path.separator");
	static {
		File dir = new File(Config.logDir);
		dir.mkdirs();
		
		SimpleFormatter sf = new SimpleFormatter(){
			public String format(LogRecord record){
				return record.getLevel() + ": " + record.getMessage() + "\n";
			}
		};
//generator logger		
		logger.setUseParentHandlers(false);
		try {
		FileHandler fh = new FileHandler(Config.logDir + fs + "ajmlc.log", false);
		fh.setFormatter(sf);
		logger.addHandler(fh);
		
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
//web server logger						
		serverLogger.setUseParentHandlers(false);
		try {
			FileHandler serverFh = new FileHandler(Config.logDir + fs + "server.log", 1000000, 10, true);
			serverFh.setFormatter(sf);
			serverLogger.addHandler(serverFh);
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
//app servlet logger
		servletLogger.setUseParentHandlers(false);
		try {
			//FileHandler servletFh = new FileHandler(Config.logDir + fs + "servlet.log%u");
			FileHandler servletFh = new FileHandler(Config.logDir + fs + "servlet.log%g", 1000000, 10, false);
			servletFh.setFormatter(sf);
			servletLogger.addHandler(servletFh);
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
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
	
	public static void main(String[] args) {
		servletLogger.info("test");
	}
	
	
}
