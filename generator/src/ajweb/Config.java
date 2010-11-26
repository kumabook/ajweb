package ajweb;

import ajweb.utils.FileUtils;

public class Config {
	public static String fs = FileUtils.fs;
	public static String ps = System.getProperty("path.separator");
	public static String workDir = "work/";
	public static String derbyDir = "work/derby";
	public static String libDir = "lib" + fs;
	public static String templateFolder = "resources" + fs + "template" + fs;
	public static String logDir = "logs" + fs;
	public static String serverLogDir = logDir + fs + "";
	public static String serveletLogDir = logDir + fs + "";
	public static boolean isOverWrite = true;
	public static boolean isStandardOutput = true;
	public static long TIMEOUT = 60000;//ポーリングのタイムアウトmillsecond
	public static int port = 8080;
	
	public static boolean isJar = false;
	
	
}
