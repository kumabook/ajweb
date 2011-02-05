package ajweb.server;

import java.awt.Desktop;
import java.io.File;
import java.net.URI;

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
		//String[]  testArgs = {"chat.war"};
		//args = testArgs;
		int port = 8080;
		String appName = null;
		String target = null; //
		boolean isWar = true; //war か　ソースディレクトリか
		Boolean isClean = false; // データベースを削除するかどうか
		if(args.length == 0){
			//System.out.println("ajweb: please input war file!");
			Server.run();
			return;
		}
		else {
//			 target = args[0];
//			appName = new File(target).getName().replaceAll("\\..*", ""); //ajml中にapplicaitonの名前がない場合
		}
		//オプションを取得
		for (int i = 0; i < args.length; ++i) {
            if ("-appname".equals(args[i])) {
                appName = args[++i];
            } 
            else if ("-source".equals(args[i])) {
                isWar = false;
                File targetFile = new File(args[++i]);
                if(appName==null)
                	appName = targetFile.getName();
                target = targetFile.getPath();
                
            } 
            else if ("-war".equals(args[i])) {
                isWar = true;
                File targetFile = new File(args[++i]);
                appName = targetFile.getName().replaceAll("\\..*", "");;
                target = targetFile.getPath();
                
            } 
            else if ("-port".equals(args[i])) {//作成されたアプリを立ち上げる  
                port = Integer.parseInt(args[++i]);
            } 
            else if ("-clean".equals(args[i])) {//データベース初期化するか
                isClean = true;
            } 
            else if ("-help".equals(args[i])){
            	System.err.println("ajweb:引数指定の誤り：未知の引数が指定されました");
            }
		}
		

		if(isClean){
			
		}

		if(appName==null){
			File targetFile = new File(args[0]);
			if(targetFile.isDirectory())
				appName = targetFile.getName();
			else {
				appName = targetFile.getName().replaceAll("\\..*", "");
			}
		}
		
		if(target==null){
			target = new File(args[0]).getPath();
		}
		if(isWar)
			System.out.println("ajweb launch application by War File: " + target +" appName " +  appName + ":" + port);
		else 
			System.out.println("ajweb launch application by Source Folder: " + target +" appName " +  appName + ":" + port);
		if(isWar)
			ajweb.server.Server.runWar(target, appName, port);
		else
			ajweb.server.Server.runSource(target, appName, port);
	
		
		System.out.println("access application on browser");
		Desktop desktop = Desktop.getDesktop();
		desktop.browse(new URI("http://localhost:" + port + "/" + appName));	
	}
}
