package ajweb.server;

import java.awt.Desktop;
import java.net.URI;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;

import org.eclipse.jetty.webapp.WebAppContext;

/**
 * デバック用、
 * @author hiroki
 *
 */
public class Server extends Thread{
	static int port = 8080;
	static String ajwebHome = ".";
	
	static public void run(String appName) throws Exception{
		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(port);

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
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + port);
		server.start();
		
		System.out.println("access application on browser");
		Desktop desktop = Desktop.getDesktop();
		desktop.browse(new URI("http://localhost:" + port + "/" + appName));	
		server.join();
		
	}
	
	static public void runSource(String appName) throws Exception{
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
		
		WebAppContext webapp = new WebAppContext();
		webapp.setContextPath("/"+appName);
//		webapp.setWar(appName+".war");
		webapp.setDescriptor("./WEB-INF/web.xml");
		webapp.setResourceBase(".");
		webapp.setParentLoaderPriority(true);
		
		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] { new LogHandler(), cache_handler, webapp, resource_handler,  new DefaultHandler() });
		server.setHandler(handlers);
		
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + port);
		
		server.start();
		
		
		System.out.println("display application on browser");
		//Desktop desktop = Desktop.getDesktop();
		//desktop.browse(new URI("http://localhost:8080/" + appName));	
		server.join();	
		
	}
	static public void runSource(String baseDir, String appName) throws Exception{
		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(port);
		
		ResourceHandler resource_handler = new ResourceHandler();
		resource_handler.setDirectoriesListed(true);
		resource_handler.setWelcomeFiles(new String[]{ "index.html" });
		resource_handler.setResourceBase(ajwebHome + "/resources/htdocs");
		resource_handler.setCacheControl("no-cache");

		
		CacheManifestHandler cache_handler = new CacheManifestHandler();
		cache_handler.setDirectoriesListed(true);
		cache_handler.setResourceBase(".");
		cache_handler.setCacheControl("no-cache");

		
		WebAppContext webapp = new WebAppContext();
		webapp.setContextPath("/"+appName);
//		webapp.setWar(appName+".war");
		webapp.setDescriptor("./WEB-INF/web.xml");
		webapp.setResourceBase(baseDir);
		webapp.setParentLoaderPriority(true);
		
		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] { new LogHandler(), cache_handler, webapp, resource_handler,  new DefaultHandler() });
		server.setHandler(handlers);
		
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + port);
		
		server.start();
		
		//System.out.println("display application on browser");
		//Desktop desktop = Desktop.getDesktop();
		//desktop.browse(new URI("http://localhost:8080/" + appName));	
		server.join();	
	}
	public static void main(String[] args) throws Exception {
		
//		System.out.println(args[0]);
		
		String baseDir = args[0];
		String appName = args[1];//"chat";
//		if(args[0].isEmpty())
//		appName = args[0]; 
		runSource(baseDir + "/", appName);
	}
}
