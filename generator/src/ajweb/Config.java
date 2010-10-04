package ajweb;

import ajweb.utils.FileUtils;

public class Config {
	public static String fs = FileUtils.fs;
	public static String ps = System.getProperty("path.separator");
	public static String workDir = ".ajweb";
	public static String libDir = "lib" + fs;
	public static String jslibFile = ".."+fs+"js"+fs+"dist"+fs+"AjWeb.js";
	public static String templateFolder = "./resources/template/";
	public static String appName = "default";
	}
