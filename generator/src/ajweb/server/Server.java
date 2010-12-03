package ajweb.server;

import java.io.File;
import java.util.logging.Level;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.webapp.WebAppContext;
import ajweb.Config;

/**
 * アプリを立ち上げる
 * @author hiroki
 *
 */
public class Server {
	
	static public void run() throws Exception{
		ajweb.utils.Log.servletLogger.setLevel(Level.ALL);
		
		//ajwebServer = new org.eclipse.jetty.server.Server(port);
		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(Config.port);
		
		/*ResourceHandler resource_handler = new ResourceHandler();
		resource_handler.setDirectoriesListed(true);
		resource_handler.setCacheControl("no-cache");
		resource_handler.setWelcomeFiles(new String[]{ "index.html" });
		resource_handler.setResourceBase(ajwebHome + "/resources/htdocs");*/
		CacheManifestHandler cache_handler = new CacheManifestHandler();
		cache_handler.setDirectoriesListed(true);
		cache_handler.setResourceBase(".");
		cache_handler.setCacheControl("no-cache");
		HandlerList handlers = new HandlerList();
		
		handlers.addHandler(new LogHandler());
		handlers.addHandler(cache_handler);
		
		File appDir = new File("webapps/");
		File[] apps = appDir.listFiles();

		for(int i = 0; i < apps.length; i++){//webappディレクトリがあれば、追加
			if(apps[i].isDirectory() && !apps[i].getName().matches("\\..*|log")){
				WebAppContext webapp = new WebAppContext();
				webapp.setContextPath("/" + apps[i].getName());
				webapp.setDescriptor(apps[i].getAbsolutePath() + "/WEB-INF/web.xml");
				webapp.setResourceBase(apps[i].getAbsolutePath() + "/");
				File libDir = new File(apps[i].getAbsolutePath() + "/WEB-INF/lib/");
				webapp.setExtraClasspath("classes");
				File[] libFiles = libDir.listFiles();
				for(int j = 0; j < libFiles.length; j++){
					if(libFiles[j].getName().matches(".*\\.jar")){
						webapp.setExtraClasspath(libFiles[j].getAbsolutePath());
						// System.out.println(libFiles[j].getAbsolutePath());
					}
				}
				
				
				
				webapp.setParentLoaderPriority(true);
				handlers.addHandler(webapp);
			}
			else if(apps[i].getName().matches(".*\\.war")){//warファイルなら追加
				String appName = apps[i].getName().split("\\.")[0];
				WebAppContext webapp = new WebAppContext();
				System.out.println("app " + appName + "  deploy on test server");
				webapp.setContextPath("/" + appName);
			//webapp.setWar(appName+".war");
				webapp.setWar(apps[i].getPath());
				//webapp.setResourceBase(apps[i].getAbsolutePath() + "/");
				webapp.setParentLoaderPriority(true);
				handlers.addHandler(webapp);
			}
		}

		
		
//		handlers.addHandler(resource_handler);
		handlers.addHandler(new DefaultHandler());
		//ajwebServer.setHandler(handlers);
		server.setHandler(handlers);
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + Config.port);
				
		server.start();
		server.join();	
		//System.out.println("display application on browser");
		//Desktop desktop = Desktop.getDesktop();
		//desktop.browse(new URI("http://localhost:8080/" + appName));	
		
	}
	
	static public void runWar(String war, String appName, int port) throws Exception{
		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(port);

		WebAppContext webapp = new WebAppContext();
		webapp.setResourceBase(appName);
		webapp.setContextPath("/"+appName);
		webapp.setWar(war);
		
		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] { new LogHandler(), webapp, /*resource_handler,*/  new DefaultHandler() });
		server.setHandler(handlers);
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + port);
		server.start();
		server.join();
	}
	

	static public void runSource(String sourceDir, String appName, int port) throws Exception{
		System.out.println(sourceDir + "   " + appName  + "  "  + port);
		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(port);
		
		
		CacheManifestHandler cache_handler = new CacheManifestHandler();
		cache_handler.setDirectoriesListed(true);
		cache_handler.setResourceBase(sourceDir);
		cache_handler.setCacheControl("no-cache");

		
		WebAppContext webapp = new WebAppContext();
		webapp.setContextPath("/"+appName);
//		webapp.setWar(appName+".war");
		webapp.setDescriptor("./WEB-INF/web.xml");
		webapp.setResourceBase(sourceDir);
		webapp.setParentLoaderPriority(true);
		
		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] { new LogHandler(), cache_handler, webapp, /*resource_handler,*/  new DefaultHandler() });
		server.setHandler(handlers);
		
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + port);
		
		server.start();
		
		//System.out.println("display application on browser");
		//Desktop desktop = Desktop.getDesktop();
		//desktop.browse(new URI("http://localhost:8080/" + appName));	
		server.join();	
	}
}
