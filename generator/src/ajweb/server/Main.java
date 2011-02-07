package ajweb.server;

import java.io.File;
import ajweb.Config;

/**
 * ajwebに組み込みのサーバを立ち上げる
 * @author hiroki
 *
 */
public class Main extends Thread{
	static String ajwebHome = ".";
	
	public static void main(String[] args) throws Exception {
		Config.setBaseDir(".");
		int port = 8080;
		String webappsDir = "webapps";
		boolean isLaunchBrowser = false;
		String appName = null; //app name
		String target = null; //file
		boolean isWar = true; //war か　ソースディレクトリか

		//オプションを取得
		for (int i = 0; i < args.length; ++i) {
            if ("-appname".equals(args[i])) {
                appName = args[++i];
            } 
            else if ("-src".equals(args[i])) {//作成されたアプリを立ち上げる   ディレクトリ指定
                isWar = false;
                File targetFile = new File(args[++i]);
                if(appName==null)
                	appName = targetFile.getName();
                target = targetFile.getPath();
            } 
            else if ("-war".equals(args[i])) {//作成されたアプリを立ち上げる  warファイル指定　  
                isWar = true;
                File targetFile = new File(args[++i]);
                appName = targetFile.getName().replaceAll("\\..*", "");;
                target = targetFile.getPath();
            } 
            else if ("-port".equals(args[i])) {
                port = Integer.parseInt(args[++i]);
            }
            else if("-webapps".equals(args[i])){
            	webappsDir = args[++i];
            }
            else if("-browser".equals(args[i])){
            	isLaunchBrowser = true;
            }
            else if ("-help".equals(args[i])){
            	System.err.println("ajweb:引数指定の誤り：未知の引数が指定されました");
            }
		}

		if(appName==null){
			Server.run(port, webappsDir, isLaunchBrowser);
		}

		if(isWar){
			System.out.println("ajweb launch application by War File: " + target +" appName " +  appName + ":" + port);
			ajweb.server.Server.runWar(target, appName, port, isLaunchBrowser);
		}
		else {
			System.out.println("ajweb launch application by Source Folder: " + target +" appName " +  appName + ":" + port);
			ajweb.server.Server.runSource(target, appName, port, isLaunchBrowser);
		}
	}
}
