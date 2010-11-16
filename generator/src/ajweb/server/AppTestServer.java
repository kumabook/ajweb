package ajweb.server;

//import java.awt.Desktop;
import java.io.File;
import java.util.logging.Level;

import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.webapp.WebAppContext;

public class AppTestServer {
	static int port = 8888;
	static String ajwebHome = ".";
	//public static org.eclipse.jetty.server.Server ajwebServer;
	public static void main(String[] args) throws Exception {
		ajweb.utils.Log.servletLogger.setLevel(Level.ALL);
		
		//ajwebServer = new org.eclipse.jetty.server.Server(port);
		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(port);
		
		ResourceHandler resource_handler = new ResourceHandler();
		resource_handler.setDirectoriesListed(true);
		resource_handler.setCacheControl("no-cache");
		resource_handler.setWelcomeFiles(new String[]{ "index.html" });
		resource_handler.setResourceBase(ajwebHome + "/resources/htdocs");
		
		
		CacheManifestHandler cache_handler = new CacheManifestHandler();
		cache_handler.setDirectoriesListed(true);
		cache_handler.setResourceBase(".");
		cache_handler.setCacheControl("no-cache");
		HandlerList handlers = new HandlerList();
		
		handlers.addHandler(new LogHandler());
		handlers.addHandler(cache_handler);
		
		File appDir = new File("./test/app");
		File[] apps = appDir.listFiles();
		
		for(int i = 0; i < apps.length; i++){
			if(apps[i].isDirectory() && !apps[i].getName().matches("\\..*|log")){
				WebAppContext webapp = new WebAppContext();
				System.out.println("app " + apps[i].getName() + "  deploy on test server");
				webapp.setContextPath("/" + apps[i].getName());
//			webapp.setWar(appName+".war");
				webapp.setDescriptor(apps[i].getAbsolutePath() + "/WEB-INF/web.xml");
				webapp.setResourceBase(apps[i].getAbsolutePath() + "/");
				webapp.setParentLoaderPriority(true);
				handlers.addHandler(webapp);
			}
		}

		
		
		handlers.addHandler(resource_handler);
		handlers.addHandler(new DefaultHandler());
		//ajwebServer.setHandler(handlers);
		server.setHandler(handlers);
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + port);
		
		//server.start();
		//ajwebServer.start();
		//server.join();	
		//ajwebServer.join();	
		
		
		
		server.start();
		server.join();	
		//System.out.println("display application on browser");
		//Desktop desktop = Desktop.getDesktop();
		//desktop.browse(new URI("http://localhost:8080/" + appName));	
		
	}
}
