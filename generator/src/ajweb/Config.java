package ajweb;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.util.HashMap;

import org.eclipse.jetty.util.ajax.JSON;

import ajweb.utils.FileUtils;

@SuppressWarnings("unchecked")
public class Config {
	public static String fs = FileUtils.fs;
	public static String ps = System.getProperty("path.separator");
	
	public static String baseDir = ".";
	public static String workDir;
	public static String derbyDir = "work/derby";
	public static String libDir;
	public static String distDir;
	public static String templateFolder;
	public static String logDir = "log/";
	public static String serverLogDir;
	public static String serveletLogDir;
	public static boolean isOverWrite = true;
	//public static boolean isStandardOutput = true;
	public static PrintStream out = System.out;
	public static long TIMEOUT = 60000;//ロングポーリングのタイムアウトmillsecond
	public static long LONGPOLLING_INTERVAL = 1;//ロングポーリングのタイムアウトmillsecond
	public static long POLLING_INTERVAL = 3000;//ポーリングのインターバル
	public static int port = 443;
	
	public static boolean isJar 	= false;
	static {
		File conf_json = new File("conf/generator.json");
		String json;
		try {
			json = ajweb.utils.FileUtils.read(conf_json);
			HashMap<String, ?> configs = (HashMap<String, ?>) JSON.parse(json);
			
			Long port_long = (Long) configs.get("port"); 
			port = port_long.intValue();
			String derbyDir_str = (String) configs.get("derbyDir");
			if(derbyDir != null)
				derbyDir = derbyDir_str;
			else 
				derbyDir = "work/derby";
			String logDir_str = (String) configs.get("logDir");
			if(logDir_str != null)
				logDir = logDir_str;
			else 
				logDir = "log/";
		} catch (IOException e) {
			System.out.println("conf fileが見つかりません");
		}
		try {
			setBaseDir(".");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static void setBaseDir(String str) throws IOException{
		baseDir = str;
		workDir = baseDir + fs + "work/generator";
		libDir = baseDir + fs + "lib" + fs;
		templateFolder = baseDir + fs + "resources" + fs + "template" + fs;
		serverLogDir = logDir + fs + "";
		serveletLogDir = logDir + fs + "";
	}

}
