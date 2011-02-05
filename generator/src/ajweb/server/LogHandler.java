package ajweb.server;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.AbstractHandler;

import ajweb.utils.Log;

public class LogHandler extends AbstractHandler {

	@Override
	public void handle(String arg0, Request arg1, HttpServletRequest arg2,
			HttpServletResponse arg3) throws IOException, ServletException {
			String contextPath = arg1.getRequestURI();
			
			//System.out.println("request context path :" + contextPath);
			Log.serverLogger.info("request context path :" + contextPath);
	}	
}
