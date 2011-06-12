package ajweb.server;

import java.awt.Desktop;
import java.io.File;
import java.net.URI;
import java.util.logging.Level;

import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.nio.SelectChannelConnector;
import org.eclipse.jetty.webapp.WebAppContext;

/**
 * アプリを立ち上げる
 * @author hiroki
 *
 */
public class Server {
	static public void run(int port, String webappsDir,boolean isLaunchBrowser) throws Exception{
		ajweb.utils.Log.servletLogger.setLevel(Level.ALL);
		
		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(port);

		CacheManifestHandler cache_handler = new CacheManifestHandler();
		cache_handler.setDirectoriesListed(true);
		cache_handler.setResourceBase(".");
		cache_handler.setCacheControl("no-cache");
		HandlerList handlers = new HandlerList();
		
		handlers.addHandler(new LogHandler());
		handlers.addHandler(cache_handler);
		
		File appDir = new File(webappsDir);
		File[] apps = appDir.listFiles();

		for(int i = 0; i < apps.length; i++){//ディレクトリがあれば、追加
			if(apps[i].isDirectory() && !apps[i].getName().matches("\\..*|log")){
				WebAppContext webapp = new WebAppContext();
				webapp.setContextPath("/" + apps[i].getName());
				webapp.setDescriptor(apps[i].getAbsolutePath() + "/WEB-INF/web.xml");
				webapp.setResourceBase(apps[i].getAbsolutePath() + "/");
				webapp.setTempDirectory(new File("./work/jetty/" + apps[i].getName()));
				File libDir = new File(apps[i].getAbsolutePath() + "/WEB-INF/lib/");
				webapp.setExtraClasspath("classes");
				webapp.setExtraClasspath("dist/ajweb.jar");
				File[] libFiles = libDir.listFiles();
				for(int j = 0; j < libFiles.length; j++){
					if(libFiles[j].getName().matches(".*\\.jar")){
						webapp.setExtraClasspath(libFiles[j].getAbsolutePath());
//						System.out.println(libFiles[j].getAbsolutePath());
					}
				}
							
				webapp.setParentLoaderPriority(true);
				handlers.addHandler(webapp);
			}
/*			else if(apps[i].getName().matches(".*\\.war")){//warファイルなら追加
				String appName = apps[i].getName().split("\\.")[0];
				WebAppContext webapp = new WebAppContext();
				System.out.println("app " + appName + "  deploy on test server");
				webapp.setContextPath("/" + appName);
			//webapp.setWar(appName+".war");
				webapp.setWar(apps[i].getPath());
				//webapp.setResourceBase(apps[i].getAbsolutePath() + "/");
				webapp.setParentLoaderPriority(true);
				handlers.addHandler(webapp);
			}*/
		}

		
		//jslib用のhandlerを追加
		WebAppContext jslib_handler = new WebAppContext();
		jslib_handler.setContextPath("/jslib");
		jslib_handler.setTempDirectory(new File("./work/jetty/jslib"));
		jslib_handler.setResourceBase("../jslib/src/");
		handlers.addHandler(jslib_handler);
		
		//jsdoc用のhandlerを追加
		WebAppContext jsdoc_handler = new WebAppContext();
		jsdoc_handler.setContextPath("/jsdoc");
		jsdoc_handler.setTempDirectory(new File("./work/jetty/jsdoc"));
		jsdoc_handler.setResourceBase("../jslib/doc/");
		handlers.addHandler(jsdoc_handler);
		
		//javaDoc用のhandlerを追加
		WebAppContext javaDoc_handler = new WebAppContext();
		javaDoc_handler.setContextPath("/javaDoc");
		javaDoc_handler.setTempDirectory(new File("./work/jetty/javaDoc"));
		javaDoc_handler.setResourceBase("./doc");
		handlers.addHandler(javaDoc_handler);

		handlers.addHandler(new DefaultHandler());
		//ajwebServer.setHandler(handlers);
		server.setHandler(handlers);
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + port);
		
		
		Connector connector = new SelectChannelConnector();
		connector.setPort(8088);
		
		server.addConnector(connector);

		
		server.start();
		if(isLaunchBrowser){
			System.out.println("display application on browser");
			Desktop desktop = Desktop.getDesktop();
			desktop.browse(new URI("http://localhost:" + port + "/"));
		}
		server.join();
	}
	
	static public void runWar(String war, String appName, int port, boolean isLaunchBrowser) throws Exception{
		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(port);

		WebAppContext webapp = new WebAppContext();
		webapp.setContextPath("/"+appName);
		webapp.setTempDirectory(new File("./work/jetty/"+appName));
		webapp.setWar(war);
		//webapp.setParentLoaderPriority(true);
		
		HandlerList handlers = new HandlerList();
		handlers.addHandler(new LogHandler());
		handlers.addHandler(webapp);
				
		//jslib用のhandlerを追加
		WebAppContext jslib_handler = new WebAppContext();
		jslib_handler.setContextPath("/jslib");
		jslib_handler.setTempDirectory(new File("./work/jetty/jslib"));
		jslib_handler.setResourceBase("../jslib/src/");
		
		handlers.addHandler(jslib_handler);
		
		handlers.addHandler(new DefaultHandler());
		//handlers.setHandlers(new Handler[] { new LogHandler(), webapp, /*resource_handler,*/  new DefaultHandler() });
		server.setHandler(handlers);
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + port);
		server.start();
		if(isLaunchBrowser){
			System.out.println("display application on browser");
			Desktop desktop = Desktop.getDesktop();
			desktop.browse(new URI("http://localhost:" + port+ "/" + appName));
		}
		server.join();
	}
	

	static public void runSource(String sourceDir, String appName, int port, boolean isLaunchBrowser) throws Exception{
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
		webapp.setTempDirectory(new File(sourceDir));
		webapp.setParentLoaderPriority(true);
		
		//jslib用のhandlerを追加
		WebAppContext jslib_handler = new WebAppContext();
		jslib_handler.setContextPath("/jslib");
		jslib_handler.setTempDirectory(new File("./work/jetty/jslib"));
		jslib_handler.setResourceBase("../jslib/src/");
				
		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] { new LogHandler(), cache_handler, webapp, jslib_handler,/*resource_handler,*/  new DefaultHandler() });
		server.setHandler(handlers);
		
		
	
		
		
		
		
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + port);
		server.start();
		if(isLaunchBrowser){
			System.out.println("display application on browser");
			Desktop desktop = Desktop.getDesktop();
			desktop.browse(new URI("http://localhost:" + port+ "/" + appName));
		}
		server.join();	
	}
}
