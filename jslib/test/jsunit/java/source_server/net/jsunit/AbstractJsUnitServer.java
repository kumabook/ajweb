package net.jsunit;

import com.opensymphony.webwork.dispatcher.ServletDispatcher;
import com.opensymphony.xwork.config.ConfigurationManager;
import com.opensymphony.xwork.config.ConfigurationProvider;
import net.jsunit.configuration.ServerConfiguration;
import net.jsunit.configuration.ServerType;
import net.jsunit.utility.XmlUtility;
import org.jdom.Element;
import org.mortbay.http.SocketListener;
import org.mortbay.http.handler.ResourceHandler;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.servlet.ServletHttpContext;
import org.mortbay.start.Monitor;
import org.mortbay.jetty.servlet.WebApplicationContext;
import org.mortbay.util.FileResource;

import java.io.File;
import java.util.List;
import java.util.logging.Logger;

public abstract class AbstractJsUnitServer {

    protected Server httpServer;
    protected Logger logger = Logger.getLogger("net.jsunit");
    protected ServerConfiguration configuration;
    private Object originalActionExtension;
    private static final String WEBWORK_ACTION_EXTENSION = "webwork.action.extension";

    protected AbstractJsUnitServer(ServerConfiguration configuration) {
        setConfiguration(configuration);
    }

    private void setConfiguration(ServerConfiguration configuration) {
        this.configuration = configuration;
    }

    public void start() throws Exception {
        preStart();
        setUpHttpServer();
        logger.info(startingServerStatusMessage());
        httpServer.start();
        postStart();
    }

    protected void preStart() {
        originalActionExtension = com.opensymphony.webwork.config.Configuration.get(WEBWORK_ACTION_EXTENSION);
        com.opensymphony.webwork.config.Configuration.set(WEBWORK_ACTION_EXTENSION, "");
    }

    protected void postStart() {
    }

    private String startingServerStatusMessage() {
        return "Starting " +
                serverTypeName() +
                " Server with configuration:\r\n" +
                XmlUtility.asPrettyString(configuration.asXml());
    }

    protected String serverTypeName() {
        return configuration.getServerType().getDisplayName();
    }

    protected void setUpHttpServer() throws Exception {
        FileResource.setCheckAliases(false);
        httpServer = new Server();
        setUpSocketListener();
        addServerContext();
        setUpConfigurationProvider();
        setUpMonitor();
    }

    private void setUpMonitor() {
        if (Monitor.activeCount() == 0)
            Monitor.monitor();
    }

    private void setUpConfigurationProvider() {
        ConfigurationProvider provider = createConfigurationProvider();

        ConfigurationManager.destroyConfiguration();
        //noinspection unchecked
        ConfigurationManager.getConfigurationProviders().set(0, provider);
    }

    protected abstract ConfigurationProvider createConfigurationProvider();

    protected void addServerContext() throws Exception {
        ServletHttpContext jsunitContext = new ServletHttpContext();
        jsunitContext.setContextPath("jsunit");
        jsunitContext.setResourceBase(resourceBase());
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setDirAllowed(false);
        jsunitContext.addHandler(resourceHandler);
        for (String servletName : servletNames())
            jsunitContext.addServlet("webwork", "/" + servletName, ServletDispatcher.class.getName());
        httpServer.addContext(jsunitContext);

/** ajweb  test用のweb applicaitonコンテキストを追加**/
        
		String basedir = System.getProperty("ajweb.jslib.basedir");
		System.setProperty("ajweb.basedir", "../../../generator/");
        File webAppDir = new File(basedir + "/test/connect_test_app");
		WebApplicationContext webapp = new WebApplicationContext();
		System.out.println("app " + webAppDir.getName() + "  deploy on test server");
		webapp.setContextPath("/connect_test_app");
		//webapp.setWar(appName+".war");
		webapp.setDefaultsDescriptor(webAppDir.getAbsolutePath() + "/WEB-INF/web.xml");
		webapp.setResourceBase(webAppDir.getAbsolutePath() + "/");
		webapp.addClassPath(webAppDir.getAbsolutePath() + "/WEB-INF/classes");
		webapp.addClassPath(basedir + "/../generator/classes/");

		File libDir = new File(basedir + "/../generator/lib/servlet/");
		File[] servletLibs = libDir.listFiles();

		for(int i = 0; i < servletLibs.length; i++){
				System.out.println(servletLibs[i].getAbsolutePath());
				webapp.addClassPath(servletLibs[i].getAbsolutePath());	
		}

	
        ResourceHandler resource_handler = new ResourceHandler();
        resourceHandler.setDirAllowed(false);
        resourceHandler.setRedirectWelcome(true);

        webapp.addHandler(resource_handler);
		//webapp.setParentLoaderPriority(true);
		httpServer.addContext(webapp);
		
		
        File editorWebAppDir = new File(basedir + "/../generator/webapps/editor");
		WebApplicationContext editorWebapp = new WebApplicationContext();

		ResourceHandler editorResourceHandler = new ResourceHandler();
        editorResourceHandler.setDirAllowed(true);
        editorWebapp.addHandler(editorResourceHandler);

		System.out.println("app " + editorWebAppDir.getName() + "  deploy on test server");
		System.out.println("app " + editorWebAppDir.getAbsolutePath() + "  deploy on test server");
		
		editorWebapp.setContextPath("/editor");
		editorWebapp.setDefaultsDescriptor(editorWebAppDir.getAbsolutePath() + "/WEB-INF/web.xml");
		editorWebapp.setResourceBase(editorWebAppDir.getAbsolutePath() + "/");
		editorWebapp.addClassPath(editorWebAppDir.getAbsolutePath() + "/WEB-INF/classes");
		editorWebapp.addClassPath(basedir + "/../generator/classes/");
		for(int i = 0; i < servletLibs.length; i++){
				System.out.println(servletLibs[i].getAbsolutePath());
				editorWebapp.addClassPath(servletLibs[i].getAbsolutePath());	
		}
		httpServer.addContext(editorWebapp);


	}

    protected abstract String resourceBase();

    protected abstract List<String> servletNames();

    private void setUpSocketListener() {
        SocketListener listener = new SocketListener();
        listener.setPort(configuration.getPort());
        httpServer.addListener(listener);
    }

    public Element asXml() {
        return configuration.asXml();
    }

    public void finalize() throws Throwable {
        super.finalize();
        dispose();
    }

    public void dispose() {
        com.opensymphony.webwork.config.Configuration.set(WEBWORK_ACTION_EXTENSION, originalActionExtension);
        logger.info("Stopping JsUnit Server");
        try {
            if (httpServer != null)
                httpServer.stop();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public boolean isAlive() {
        return httpServer != null && httpServer.isStarted();
    }

    public ServerType serverType() {
        return configuration.getServerType();
    }

    public ServerConfiguration getConfiguration() {
        return configuration;
    }
}
