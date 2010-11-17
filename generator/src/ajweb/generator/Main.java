package ajweb.generator;

import ajweb.Config;
import java.io.*;
import java.util.logging.Logger;

/***
 * ajweb generator の実行クラス
 * @author hiroki
 *
 */

public class Main {
	
	public static String workDirectory = Config.workDir;
	public static String appName;
	public static Logger logger;
	
	
	static public String fs = Config.fs;
	static public String ps = Config.ps;
	
	/**
	 * メインメソッド。<br/>
	 * 
	 * 
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		//System.setProperty("ajweb.work",".ajweb" + ajweb.generator.Main.fs + "runtime");
		String ajml;
		File ajmlFile;
		Boolean isWar = true; //ソースのままを生成するか
		String out = null; //
		if(args.length == 0){
			System.out.println("ajmlc: please input ajml file!");
			return;
		}
		else {
			ajml = args[0];
			ajmlFile = new File(ajml);
			appName = new File(ajml).getName().replaceAll("\\..*", ""); //ajml中にapplicaitonの名前がない場合
		}
		//オプションを取得
		for (int i = 1; i < args.length; ++i) {
            if ("-appname".equals(args[i])) {
                appName = args[++i];
            } 
            else if ("-source".equals(args[i])) {
                isWar = false;
                out = args[++i];
            }
            else if ("-war".equals(args[i])) {
                isWar = true;
                out = args[++i];
            }
            else if ("-help".equals(args[i])){
            	System.err.println("ajmlc:引数指定の誤り：未知の引数が指定されました");
            }
		}
		
		if(isWar){
			if(out == null)
				out = appName + ".war";			
			File warFile = new File(out);
			Compiler.generateWar(ajmlFile, warFile);
		}
		else {
			if(out == null)
				out = appName;
			//File sourceDir = new File(out);
			Compiler.generateSource(ajmlFile, out);
		}
		
//		System.out.println("ajml : "  + ajml + ",  appName : " + appName);
	}
	
}