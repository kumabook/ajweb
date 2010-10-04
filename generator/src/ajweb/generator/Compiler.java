package ajweb.generator;

import java.io.File;
import java.io.FileInputStream;

import java.io.IOException;
import java.util.ArrayList;

import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
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
	 * ajmlを読み込んで、applicationオブジェクトを生成
	 * @param ajml_file
	 * @return
	 * @throws IOException 
	 * @throws SAXException 
	 */
	public static Application parse(String ajml_file) throws IOException, SAXException{
		
		FileInputStream fi = new FileInputStream(ajml_file);
			
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
	 * アプリケーションオブジェクトからwar fileを生成
	 * @param app
	 * @param path
	 * @throws Exception 
	 */
	public static void generate(Application app, String workDir, String warFile) throws Exception{
		setup(workDir, app.appName);
		app.generate();
		javaCompile(workDir, app.appName);
		
		FileUtils.compression(workDir + FileUtils.fs + app.appName, warFile);
		System.out.println("compress "  + workDir + FileUtils.fs +app.appName +"/* to war file");		
	}
	/**
	 * アプリケーションオブジェクトからソースコードを生成
	 * @param app
	 * @param path
	 * @throws Exception 
	 */
	public static void generateSource(Application app, String workDir) throws Exception{
		setup(workDir, app.appName);
		app.generate();
		javaCompile(workDir, app.appName);
		
	}
	/**
	 * 作業ディレクトリの作成、フレームワークコードのコピー
	 * @param temp  作業用ディレクトリの名前
	 * @param appName　アプリケーションの名前
	 * @throws Exception
	 */
	public static void setup(String temp,String appName) throws Exception{
		String fs = Config.fs;
		FileUtils.mkdir(".ajweb/");
		//System.out.println(new File(".ajweb/test.txt").createNewFile());
		FileUtils.mkdir(temp);
		FileUtils.mkdir(temp + fs + appName);
		FileUtils.mkdir(temp + fs + appName + "/jslib");
		FileUtils.mkdir(temp + fs + appName + "/WEB-INF");
		FileUtils.mkdir(temp + fs + appName + "/WEB-INF/classes");
		FileUtils.mkdir(temp + fs + appName + "/WEB-INF/src");
		FileUtils.mkdir(temp + fs + appName + "/WEB-INF/lib");
		  
		FileUtils.copyFile(".." + fs + "js" + fs + "dist" + fs + "AjWeb.js", temp + fs + appName + "/AjWeb.js");
		System.out.println(temp + fs + appName + fs + "WEB-INF/lib/test.txt");
		
		FileUtils.copyDir("lib/", temp + fs + appName + "/WEB-INF/lib/","jar");
		//外部のjavaScriptライブラリは、http経由で読み込み
				
				
	}
	/**
	 * javaソースコードのコンパイル
	 * @param workDir
	 * @param appName
	 * @throws Exception
	 */
	public static void javaCompile(String workDir, String appName) throws Exception{
		String fs = System.getProperty("file.separator");
		String ps = System.getProperty("path.separator");
		
		System.out.println("compile  Java File :");// + web_infDir + "classes/*");
		
		String web_infDir = workDir + fs + appName +  fs + "WEB-INF";
		String sourceDir = web_infDir + fs + "src" + fs;
		File[] srcFiles = FileUtils.findFiles(sourceDir, "java");
//		System.out.println("srcFiles : " + srcFiles.length);
		if(srcFiles.length != 0){
			ArrayList<String> args = new ArrayList<String>();
			args.add("-d");
			args.add(web_infDir +fs+ "classes");
			args.add("-classpath");
		

			File[] libfiles = new File("lib/").listFiles();
			String classpath = "." + fs +   ps +  "."+ fs + "classes" + ps;
			for(int i = 0; i < libfiles.length; i++){
				if(libfiles[i].getPath().endsWith(".jar"))
					classpath += libfiles[i].getPath() + ps;
			}
		
			File[] libfiles_web_inf = new File(web_infDir+fs+"lib").listFiles();
			for(int i = 0; i < libfiles_web_inf.length; i++){
				if(libfiles_web_inf[i].getPath().endsWith(".jar"))
					classpath += libfiles_web_inf[i].getPath() + ps;
			}
		
			args.add(classpath);
			
			for(int i = 0; i < srcFiles.length; i++){
				if(srcFiles[i].getPath().endsWith(".java")){
					args.add(srcFiles[i].getPath());
					System.out.println("                    " + srcFiles[i].getPath());
				}
			}
			//System.out.println("compile " + args);
			
			com.sun.tools.javac.Main.compile(args.toArray(new String[0]));
			System.out.println("compile complete. generate class files.");
			
		}
	}
}
