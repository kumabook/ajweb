package ajweb.js;


import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;

import ajweb.server.LogHandler;


public class FunctionalTestServer {
	public static void main(String[] args) throws Exception {
		org.eclipse.jetty.server.Server server = new org.eclipse.jetty.server.Server(8080);
		
		ResourceHandler resource_handler = new ResourceHandler();
		resource_handler.setDirectoriesListed(true);
		resource_handler.setWelcomeFiles(new String[]{ "index.html" });
		resource_handler.setResourceBase("../");
		
		
				
		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] { new LogHandler(), resource_handler,  new DefaultHandler() });
		server.setHandler(handlers);
		System.out.println("start ajweb server on " + java.net.InetAddress.getLocalHost().getHostName() + ":" + 8080);

		server.start();
		
		//System.out.println("display application on browser");
		//Desktop desktop = Desktop.getDesktop();
		//desktop.browse(new URI("http://localhost:80/"));	
		server.join();	
				
	}
}
