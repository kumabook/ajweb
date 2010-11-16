package ajweb.generator;

import ajweb.Config;
import ajweb.model.Application;

import ajweb.server.Server;
import ajweb.utils.*;

import java.io.*;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;


import org.xml.sax.ErrorHandler;

import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;


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
	static {
		
		logger = Logger.getLogger("ajmlc.loggin");
		Log.logger = logger;
		FileHandler fh;
		
		try {
		
			fh = new FileHandler("log" + fs + "ajmlc.log");
			fh.setFormatter(new SimpleFormatter(){
				public String format(LogRecord record){
					return record.getLevel() + ": " + record.getMessage() + "\n";
				}
			}
			);
			logger.addHandler(fh);
			logger.setLevel(Level.ALL);
//			logger.info("ajml compiler version 0.1 " + new java.util.Date().toLocaleString());
				
		} catch (Exception e) {
			System.out.println("logger error");
			e.printStackTrace();
		}
	}
	
	/**
	 * メインメソッド。<br/>
	 * 
	 * 
	 * @param args
	 * @throws Exception
	 */
	@SuppressWarnings("unused")
	public static void main(String[] args) throws Exception {
		//System.setProperty("ajweb.work",".ajweb" + ajweb.generator.Main.fs + "runtime");
		String ajml;
		Boolean source = false; //ソースのままを生成するか
		Boolean run = false; // サーバーを実行するかどうか
		Boolean clean = false; // データベースを削除するかどうか
		if(args.length == 0){
			System.out.println("ajmlc: please input ajml file!");
			return;
		}
		else {
			ajml = args[0];
			appName = new File(ajml).getName().replaceAll("\\..*", ""); //ajml中にapplicaitonの名前がない場合
		}
		//コンパイルオプションを取得
		for (int i = 1; i < args.length; ++i) {
            if ("-appname".equals(args[i])) {
                appName = args[++i];
            } 
            else if ("-source".equals(args[i])) {
                run = true;
            } 
            else if ("-run".equals(args[i])) {
                run = true;
            } 
            else if ("-clean".equals(args[i])) {
                clean = true;
            } 
            else if ("-help".equals(args[i])){
            	System.err.println("ajmlc:引数指定の誤り：未知の引数が指定されました");
            }
		}
		
		System.out.println("ajml : "  + ajml + ",  appName : " + appName);
//		generate("resources/" + ajml);
	//	generate(ajml);
		
		/*if(clean){
			for(DBData dbdata: AjmlHandler.app.dbDatum){
				DBAccess dbAccess = new DBAccess(dbdata.dbDriver, dbdata.dbName);
				try{
					dbAccess.drop(dbdata.name);
					dbAccess.create(dbdata.name, dbdata.properties);
					System.out.println("create table:" + dbdata.name);
//					System.out.println("initialize table:" + dbdata.name);
				} catch (Exception e){
						//					e.printStackTrace();
//					System.out.println("table:" + dbdata.name + " is not exists");
					dbAccess.create(dbdata.name, dbdata.properties);
					System.out.println("create table:" + dbdata.name);
//					System.out.println("initialize table:" + dbdata.name);
				}
//				System.out.println("drop table:" + dbdata.name + " if exists");
			}
		}*/
            			
		if(run) //作成されたアプリを立ち上げるデバッグ用
			Server.runSource(workDirectory +fs+ appName, appName);
	}
	
}