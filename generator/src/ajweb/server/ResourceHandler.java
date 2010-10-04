package ajweb.server;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Request;

public class ResourceHandler extends
		org.eclipse.jetty.server.handler.ResourceHandler {
	@Override
	public void handle(String target, Request baseRequest, HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException {
		System.out.println("resource handler");
		
		super.handle(target, baseRequest, request, response);
	}
}
