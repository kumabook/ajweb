package ajweb;

import java.io.IOException;
import java.io.PrintStream;
import ajweb.utils.FileUtils;

public class Config {
	public static String fs = FileUtils.fs;
	public static String ps = System.getProperty("path.separator");
	
	public static String baseDir = ".";
	public static String workDir = baseDir + fs + "work/generator";

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
	public static String JSLIB_LOCATION = "http://www.tt.cs.titech.ac.jp/~kumamoto/ajweb/jslib";
	
	public static boolean isJar 	= false;
	static {
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
