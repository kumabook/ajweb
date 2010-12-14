package ajweb.editor;

import java.util.HashMap;
import java.io.ByteArrayInputStream;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

import javax.annotation.Untainted;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import com.sun.org.apache.xml.internal.serializer.OutputPropertiesFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;


import ajweb.Config;
import ajweb.servlet.AbstractServlet;


@SuppressWarnings({"all"})
public class GenerateServlet extends AbstractServlet {
		protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	    {	
//			System.out.println("doGet");
			download(req, resp);
		}


		protected void doPost(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
			System.out.println("GenerateServlet: doPost ");
			String outputType = req.getParameter("type");
			if(outputType.equals("ajml")){
				download(req, resp);
			}
			else if(outputType.equals("war")){
				generate(req, resp);
			}
		}
		
		/**
		 * 	送られてきたajmlを整形してダウンロードさせる
		 * @param request
		 * @param response
		 * @throws ServletException
		 * @throws IOException
		 */
		
		private void download(HttpServletRequest request,
				HttpServletResponse response) throws ServletException, IOException {
			InputStream in = null;
			response.setCharacterEncoding("UTF-8");
			PrintWriter writer = response.getWriter();
			
			StreamResult result = new StreamResult(writer);
			try {
				String ajml = request.getParameter("content");
				if(org.apache.commons.lang.SystemUtils.IS_OS_WINDOWS){
					ajml = new String(ajml.getBytes("iso-8859-1"), "UTF-8");
				}
				String filename = request.getParameter("filename");
				in = new ByteArrayInputStream(ajml.getBytes("UTF-8"));
				DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
				DocumentBuilder db = dbf.newDocumentBuilder();
				Document doc = db.parse(new InputSource(in)); 
				doc.setXmlStandalone(true);
				
				TransformerFactory tf = TransformerFactory.newInstance();
								
				Transformer transformer = tf.newTransformer();
				transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
				
				transformer.setOutputProperty(OutputKeys.INDENT, "yes");
				transformer.setOutputProperty(OutputKeys.METHOD, "xml");
				
				transformer.setOutputProperty(OutputPropertiesFactory.S_KEY_INDENT_AMOUNT, "2");
							
				response.setContentType("application/octet-stream");
				response.setHeader("Content-Disposition", "filename=\""+ filename + ".ajml\"");
				transformer.transform(new DOMSource(doc), result);
				
			} catch (Exception e){
					writer.println(e.toString());
					e.printStackTrace();
			}
		}
		
		private void generate(HttpServletRequest request,
				HttpServletResponse response) throws IOException{
					
			OutputStream out = response.getOutputStream();
			InputStream in = null;
			try {
				String ajml = request.getParameter("content");
				if(org.apache.commons.lang.SystemUtils.IS_OS_WINDOWS)
					ajml = new String(ajml.getBytes("iso-8859-1"), "UTF-8");

				String filename = request.getParameter("filename");
				StreamResult result = new StreamResult(new File(filename + ".ajml"));
				in = new ByteArrayInputStream(ajml.getBytes("UTF-8"));

				DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
				DocumentBuilder db = dbf.newDocumentBuilder();
				Document doc = db.parse(new InputSource(in)); 
				doc.setXmlStandalone(true);
				
				TransformerFactory tf = TransformerFactory.newInstance();
								
				Transformer transformer = tf.newTransformer();
//				transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
				transformer.setOutputProperty(OutputKeys.INDENT, "yes");
				transformer.setOutputProperty(OutputKeys.METHOD, "xml");
				transformer.setOutputProperty(OutputKeys.INDENT, "2");
				
				
				transformer.transform(new DOMSource(doc), result);
				String basedir = System.getProperty("ajweb.basedir");
				if(basedir != null){
					Config.setBaseDir(basedir);
				}
				else 
					Config.templateFolder = "../generator/resources/template";

				ajweb.generator.Compiler.generateWar(new File(filename+".ajml"), new File(filename+".war"));
				
				InputStream warIn = new FileInputStream(filename + ".war");
				response.setContentType("application/octet-stream");
				response.setHeader("Content-Disposition", "filename=\""+ filename + ".war\"");
				 byte[] buff = new byte[1024];
			        int len = 0;
			        while ((len = warIn.read(buff, 0, buff.length)) != -1) {
			            out.write(buff, 0, len);
			        }
			} catch (Exception e){
					
					response.setContentType("text/html");
					response.setCharacterEncoding("UTF-8");
					e.printStackTrace();
			}
		}
		protected HashMap<String, String> getDatabaseProperties(String tablename){
				return new HashMap<String, String>();
		}
}
