package ajweb.server;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.ResourceHandler;

public class CacheManifestHandler extends ResourceHandler {
	@Override
	public void handle(String target, Request baseRequest, HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException {
		//System.out.println("manifest handler");
		if(target.matches(".*\\.manifest")){
			System.out.println("manifest file");
			super.handle(target, baseRequest, request, response);
			response.setContentType("text/cache-manifest");
			System.out.println(response.getContentType());
		}
		
		
	}
}
