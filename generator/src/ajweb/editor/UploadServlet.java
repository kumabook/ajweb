package ajweb.editor;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

@SuppressWarnings("serial")
public class UploadServlet extends HttpServlet {
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		super.doGet(req, resp);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
	    System.out.println("doPost uploadServlet");
	    resp.setContentType("text/html");
		PrintWriter out = resp.getWriter();
		String editor = "editor";
	    DiskFileItemFactory factory = new DiskFileItemFactory();
	    ServletFileUpload upload = new ServletFileUpload(factory);

	    factory.setSizeThreshold(1024);
	    upload.setSizeMax(-1);
	    upload.setHeaderEncoding("UTF-8");

	    try {
	      List<FileItem> list =  (List<FileItem>) upload.parseRequest(req);
	      Iterator<FileItem> iterator = list.iterator();
	      while(iterator.hasNext()){
	        FileItem fItem = iterator.next();
	        if(fItem.isFormField()){
	        	if(fItem.getFieldName().equals("editor"))
	        		editor = fItem.getString();
	        }
	        else{
	          String fileName = fItem.getName();
	          if((fileName != null) && (!fileName.equals(""))){
	        	  String ajml = fItem.getString();
	        	  ajml = ajml.replaceAll("\n|\r\n|\r", "'\n + '");
	        	  String response = "<html><body><script type=\"text/javascript\">\n" +
		  			"     window.parent." + editor + ".uploadDialog.hide();\n" + 
		  			"	  var parentDocument = window.parent.document;\n" +
		  			"     window.parent." + editor + ".openAjml('" + ajml + "');\n" +
		  			"	</script>now uploading!!" +
		  			"	</body>" +
		  			"	</html>";
	        	  System.out.println(response);
	        	  out.println(response);
	          }
	        }
	      }
	    }catch (FileUploadException e) {
	      e.printStackTrace();
	    }catch (Exception e) {
	      e.printStackTrace();
	    }
	  }
}