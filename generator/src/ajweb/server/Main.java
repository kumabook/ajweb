package ajweb.server;
import java.awt.Desktop;

import java.net.URI;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.webapp.WebAppContext;
/**
 * デバック用、
 * @author hiroki
 *
 */
public class Main extends Thread{
	static int port = 8080;
	static String ajwebHome = ".";
	static public void run(String appName) throws Exception{
		Server server = new Server(port);
		
		ResourceHandler resource_handler = new ResourceHandler();
		resource_handler.setDirectoriesListed(true);
		resource_handler.setWelcomeFiles(new String[]{ "index.html" });
		resource_handler.setResourceBase(ajwebHome + "/resources/htdocs");
		
		
		WebAppContext webapp = new WebAppContext();
		webapp.setContextPath("/"+appName);
		webapp.setWar(appName+".war");
		
		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] { new LogHandler(), webapp, resource_handler,  new DefaultHandler() });
		server.setHandler(handlers);
		System.out.println("start");
		server.start();
		
		System.out.println("display application on browser");
		Desktop desktop = Desktop.getDesktop();
		desktop.browse(new URI("http://localhost:8080/" + appName));	
		server.join();
		
	}
	public static void main(String[] args) throws Exception {
		System.setProperty("ajweb.work",".ajweb" + ajweb.generator.Main.fs + "runtime");
//		System.out.println(System.getProperty("ajweb.work"));
		
		String warFile;
		Boolean run = false;
		//ajweb run ${warFile} で.warファイルを実行
		if(args.length == 0){
			System.out.println("ajweb:error  アプリケーションファイルを入力してください");
			return;
		}
		else {
			warFile = args[0];
						
		}
		
		for (int i = 1; i < args.length; ++i) {
			if ("-run".equals(args[i])) {
                run = true;
            } 
            else {
            	System.err.println("引数指定の誤り：未知の引数が指定されました");
            }
		}
		
		            
		if(run) //作成されたアプリを立ち上げるデバッグ用
			ajweb.server.Server.run(warFile.replaceAll("\\..*", ""));
		else 
			System.out.println("アクションが指定されていません");
			

		
	}
}
