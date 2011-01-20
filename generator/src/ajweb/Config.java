package ajweb;

import java.io.PrintStream;

import ajweb.utils.FileUtils;

public class Config {
	public static String fs = FileUtils.fs;
	public static String ps = System.getProperty("path.separator");
	
	public static String baseDir = ".";
	public static String workDir = baseDir + fs + "/work/";
	public static String derbyDir = "work/derby";
	public static String libDir = baseDir + fs + "lib" + fs;
	public static String distDir = baseDir + fs + "dist" + fs;
	public static String templateFolder = baseDir + fs + "resources" + fs + "template" + fs;
	public static String logDir = baseDir + "logs" + fs;
	public static String serverLogDir = logDir + fs + "";
	public static String serveletLogDir = logDir + fs + "";
	public static boolean isOverWrite = true;
	//public static boolean isStandardOutput = true;
	public static PrintStream out = System.out;
	public static long TIMEOUT = 60000;//ロングポーリングのタイムアウトmillsecond
	public static long LONGPOLLING_INTERVAL = 1;//ロングポーリングのタイムアウトmillsecond
	public static long POLLING_INTERVAL = 3000;//ポーリングのインターバル
	public static int port = 443;
	
	public static boolean isJar 	= false;
	
	public static void setBaseDir(String str){
		baseDir = str;
		workDir = baseDir + fs + "work/";
//		derbyDir = workDir + fs + "derby";
		libDir = baseDir + fs + "lib" + fs;
		templateFolder = baseDir + fs + "resources" + fs + "template" + fs;
		logDir = baseDir + "logs" + fs;
		serverLogDir = logDir + fs + "";
		serveletLogDir = logDir + fs + "";
	}
}
