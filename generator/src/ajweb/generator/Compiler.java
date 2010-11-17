package ajweb.generator;


import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;

import java.io.IOException;
import java.util.ArrayList;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;

import org.xml.sax.ErrorHandler;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

import ajweb.Config;
import ajweb.model.Application;
import ajweb.parser.AjmlHandler;
import ajweb.utils.FileUtils;

public class Compiler {
	
	public static String js_file;
	public static String lib_directory;
	
	/**
	 * ajml��ǂݍ���ŁAapplication�I�u�W�F�N�g�𐶐�
	 * @param ajml_file
	 * @return
	 * @throws IOException 
	 * @throws SAXException 
	 */
	public static Application parse(File ajml, String outDir) throws IOException, SAXException{
		Application app = parse(ajml);
		app.outDir = outDir;
		return app;
	}
	
	public static Application parse(File ajml) throws IOException, SAXException{
		
		FileInputStream fi = new FileInputStream(ajml);
			
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
		app.outDir = Config.workDir + app.appName;
		setup(app.outDir);
		app.generate();
		javaCompile(app.outDir);
		
		FileUtils.compression(new File(app.outDir), warFile);
		if(Config.isStandardOutput)
			System.out.println("compress "  + app.outDir +"/* to war file");
		FileUtils.delete(new File(app.outDir));
		if(Config.isStandardOutput)
			System.out.println("cleanup work directory");
	}
	/**
	 * �A�v���P�[�V�����I�u�W�F�N�g����\�[�X�R�[�h�𐶐�
	 * @param app
	 * @param path
	 * @throws Exception 
	 */
	public static void generateSource(File ajml, String outDir) throws Exception{
		Application app = parse(ajml, outDir);
		setup(outDir);
		app.generate();
		javaCompile(outDir);
	}
	/**
	 * ��ƃf�B���N�g���̍쐬�A�t���[�����[�N�R�[�h�̃R�s�[
	 * @param temp  ��Ɨp�f�B���N�g���̖��O
	 * @param appName�@�A�v���P�[�V�����̖��O
	 * @throws Exception
	 */
	public static void setup(String outDir) throws Exception{
		//System.out.println(new File(".ajweb/test.txt").createNewFile());
		FileUtils.mkdir(outDir);
		//FileUtils.mkdir(temp + fs + appName + "/jslib");
		FileUtils.mkdir(outDir + "/WEB-INF");
		FileUtils.mkdir(outDir + "/WEB-INF/classes");
		FileUtils.mkdir(outDir + "/WEB-INF/src");
		FileUtils.mkdir(outDir + "/WEB-INF/lib");
		  
		//FileUtils.copyFile(".." + fs + "js" + fs + "dist" + fs + "AjWeb.js", temp + fs + appName + "/AjWeb.js");
		//System.out.println(temp + fs + appName + fs + "WEB-INF/lib/test.txt");
		
		FileUtils.copyDir("lib/servlet",  outDir + "/WEB-INF/lib/","jar");
		//�O����javaScript���C�u�����́Ahttp�o�R�œǂݍ���
				
				
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
		if(Config.isStandardOutput)
			System.out.println("compile  Java File :");// + web_infDir + "classes/*");
		
		String web_infDir = outDir +  fs + "WEB-INF";
		String sourceDir = web_infDir + fs + "src" + fs;
		File[] srcFiles = FileUtils.findFiles(sourceDir, "java");
//		System.out.println("srcFiles : " + srcFiles.length);
		if(srcFiles.length != 0){
			ArrayList<String> args = new ArrayList<String>();
			args.add("-d");
			args.add(web_infDir +fs+ "classes");
			args.add("-classpath");
		
			String classpath = "." + fs +   ps +  "."+ fs + "classes" + ps;
			/*File[] libfiles = new File("lib/").listFiles();
		
			for(int i = 0; i < libfiles.length; i++){
				if(libfiles[i].getPath().endsWith(".jar"))
					classpath += libfiles[i].getPath() + ps;
			}*/
		
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
					if(Config.isStandardOutput)
						System.out.println("                    " + srcFiles[i].getPath());
				}
			}
			JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
			int result = compiler.run(null, null, /*null*/new ByteArrayOutputStream(), args.toArray(new String[0]));
			
			//int result = com.sun.tools.javac.Main.compile(args.toArray(new String[0]));
			if(Config.isStandardOutput)
				System.out.println("compile complete. generate class files.");
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
