package ajweb.generator;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Logger;
import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import org.xml.sax.ErrorHandler;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;
import ajweb.Config;
import ajweb.JarClassLoader;
import ajweb.model.Application;
import ajweb.parser.AjmlHandler;
import ajweb.utils.FileUtils;


public class Compiler {
	
	
	public static String workDirectory = Config.workDir;
	public static String appName;
	public static Logger logger;
	
	
	static public String fs = Config.fs;
	static public String ps = Config.ps;
		
	
	/**
	 * ajml�t�@�C����ǂݍ���ŁAApplication���f���𐶐�
	 * @param ajml
	 * @return
	 * @throws IOException
	 * @throws SAXException
	 */
	
	public static Application parse(File ajml) throws IOException, SAXException{
		
		FileInputStream fi = new FileInputStream(ajml);
			
		final XMLReader r = XMLReaderFactory.createXMLReader();
		r.setErrorHandler(new SchemaErr());
		r.setFeature("http://xml.org/sax/features/validation", true);
		r.setFeature("http://apache.org/xml/features/validation/schema", true);
		r.setFeature("http://xml.org/sax/features/namespaces", true);
		AjmlHandler  ajmlHandler = new AjmlHandler(){
				{ 
					reader = r ;
				}
			};
		r.setContentHandler(ajmlHandler);
		
		r.parse(new InputSource(fi));
		fi.close();
		return ajmlHandler.app;
	}
	
	public static Application parse(InputSource is) throws SAXException, IOException{
		final XMLReader r = XMLReaderFactory.createXMLReader();
		r.setErrorHandler(new SchemaErr());
		//r.setFeature("http://xml.org/sax/features/validation", true);
		//r.setFeature("http://apache.org/xml/features/validation/schema", true);
		//r.setFeature("http://xml.org/sax/features/namespaces", true);
		AjmlHandler  ajmlHandler = new AjmlHandler(){
				{ 
					reader = r ;
				}
			};
		r.setContentHandler(ajmlHandler);
		
		r.parse(is);
				
		return ajmlHandler.app;	
	}
	
	/**
	 * �A�v���P�[�V�����I�u�W�F�N�g����war file�𐶐�
	 * @param app
	 * @param path
	 * @throws Exception 
	 */
	public static void generateWar(File ajml, File warFile) throws Exception{
		
		Application app = parse(ajml);
		String outDir = Config.workDir + app.appName;
		app.setup(outDir);
		app.generate(outDir);
		boolean result = javaCompile(outDir);
		
		if(warFile==null){
			warFile = new File(app.appName + ".war");
		}
		
		if(result){
			FileUtils.compression(new File(outDir), warFile);
			Config.out.println("compress "  + outDir +"/* to war file");
			
			FileUtils.delete(new File(outDir));
			Config.out.println("cleanup work directory");
		
			Config.out.println("generate app complete: " + warFile.getPath());
		}
		
	}
	/**
	 * �A�v���P�[�V�����I�u�W�F�N�g����\�[�X�R�[�h�𐶐�
	 * @param app
	 * @param path
	 * @throws Exception 
	 */
	public static void generateSource(File ajml, String outDir) throws Exception{
		Application app = parse(ajml);
		app.setup(outDir);
		app.generate(outDir);
		boolean result = javaCompile(outDir);
		if(result){
			Config.out.println("generate app complete: " + outDir);
		}
	}
	
	/**
	 * java�\�[�X�R�[�h�̃R���p�C��
	 * @param workDir
	 * @param appName
	 * @throws Exception
	 */
	public static boolean javaCompile(String outDir) throws Exception{
		String fs = System.getProperty("file.separator");
		String ps = System.getProperty("path.separator");
		
		Config.out.println("compile  Java File :");// + web_infDir + "classes/*");
		
		String web_infDir = outDir +  fs + "WEB-INF";
		String sourceDir = web_infDir + fs + "src" + fs;
		File[] srcFiles = FileUtils.findFiles(sourceDir, "java");
//		System.out.println("srcFiles : " + srcFiles.length);
		if(srcFiles.length != 0){
			ArrayList<String> args = new ArrayList<String>();
			args.add("-d");
			args.add(web_infDir +fs+ "classes");
			args.add("-classpath");
			
			String classpath = "." + fs +   ps ;//+  "."+ fs + "classes" + ps;
			JarClassLoader jcl = new JarClassLoader();
			if(jcl.isLaunchedFromJar())
				classpath += "." + fs + "ajweb.jar" + ps;
			else
				classpath += Config.baseDir + fs + "classes" + ps;
			

			File[] libfiles_web_inf = new File(web_infDir+fs+"lib").listFiles();
			for(int i = 0; i < libfiles_web_inf.length; i++){
				if(libfiles_web_inf[i].getPath().endsWith(".jar"))
					classpath += libfiles_web_inf[i].getPath() + ps;
			}
		
			args.add(classpath);
			
			args.add("-encoding");
			args.add("UTF8");
			
			for(int i = 0; i < srcFiles.length; i++){
				if(srcFiles[i].getPath().endsWith(".java")){
					args.add(srcFiles[i].getPath());
					Config.out.println("                    " + srcFiles[i].getPath());
				}
			}
			JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
			int result = compiler.run(null, null, 
//						null, 
					new ByteArrayOutputStream(),
					args.toArray(new String[0]));
			
			//int result = com.sun.tools.javac.Main.compile(args.toArray(new String[0]));
			
			if(result==0)
				Config.out.println("compile complete. generate class files.");
			else {
				Config.out.println("sorry compile incomplete.");
			}
			return (result==0);
		}
		return false;
	}
	
}
class SchemaErr implements ErrorHandler {
	   // �v���I�ȃG���[�����������ꍇ
	  public void fatalError(SAXParseException e) {
	    System.out.println("�v���I�ȃG���[: " + e.getLineNumber() +"�s��");
	    System.out.println(e.getMessage());
	  }
	   // �G���[�����������ꍇ
	  public void error(SAXParseException e) {
	    System.out.println("�G���[: " + e.getLineNumber() +"�s��");
	    System.out.println(e.getMessage());
	  }
	   // �x�������������ꍇ
	  public void warning(SAXParseException e) {
	    System.out.println("�x��: " + e.getLineNumber() + "�s��");
	    System.out.println(e.getMessage());
	  }
	}
