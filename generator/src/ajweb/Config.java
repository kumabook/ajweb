package ajweb;

import ajweb.utils.FileUtils;

public class Config {
	public static String fs = FileUtils.fs;
	public static String ps = System.getProperty("path.separator");
	//public static String workDir = ".ajweb";
	public static String workDir = "temp";
	public static String libDir = "lib" + fs;
	public static String jslibFile = ".."+fs+"js"+fs+"dist"+fs+"AjWeb.js";
	public static String templateFolder = "./resources/template/";
	public static String logDir = "logs";
	public static String outDir = "";
	public static String outFileName = "";
	public static String serverLogDir = logDir + fs + "";
	public static String test_derby_dir = "test/derby";
	public static boolean isStandardOutput = true;
	public static long TIMEOUT = 60000;//ポーリングのタイムアウトmillsecond
	
}
