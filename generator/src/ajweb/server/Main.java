package ajweb.server;

import java.awt.Desktop;
import java.io.File;
import java.net.URI;

/**
 * デバック用、
 * @author hiroki
 *
 */
public class Main extends Thread{
	static String ajwebHome = ".";
	
	public static void main(String[] args) throws Exception {
		String[]  testArgs = {"chat.war"};
		args = testArgs;
		int port = 8080;
		String appName = null;
		String target = null; //
		boolean isWar = true; //war か　ソースディレクトリか
		Boolean isClean = false; // データベースを削除するかどうか
		if(args.length == 0){
			System.out.println("ajweb: please input war file!");
			return;
		}
		else {
//			 target = args[0];
//			appName = new File(target).getName().replaceAll("\\..*", ""); //ajml中にapplicaitonの名前がない場合
		}
		//オプションを取得
		for (int i = 1; i < args.length; ++i) {
            if ("-appname".equals(args[i])) {
                appName = args[++i];
            } 
            else if ("-source".equals(args[i])) {
                isWar = false;
                File targetFile = new File(args[i]);
                if(appName==null)
                	appName = targetFile.getName();
                target = targetFile.getPath();
                
            } 
            else if ("-war".equals(args[i])) {
                isWar = true;
                File targetFile = new File(args[i]);
                appName = targetFile.getName();
                target = targetFile.getPath();
                
            } 
            else if ("-port".equals(args[i])) {//作成されたアプリを立ち上げる  
                port = Integer.parseInt(args[i+1]);
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
			else 
				appName = targetFile.getName().replaceAll("\\..*", "");
		}
		
		if(target==null){
			target = new File(args[0]).getPath();
		}
		
		System.out.println("ajweb launch application: " + target +" appName " +  appName + ":" + port);
		
		if(isWar)
			ajweb.server.Server.run(target, appName, port);
		else
			ajweb.server.Server.runSource(target, appName, port);
	
		
		System.out.println("access application on browser");
		Desktop desktop = Desktop.getDesktop();
		desktop.browse(new URI("http://localhost:" + port + "/" + appName));	
	}
}
