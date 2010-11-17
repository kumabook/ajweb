package ajweb.utils;


import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.nio.channels.FileChannel;
import java.util.ArrayList;

import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import ajweb.Config;


public class FileUtils {
	//public static String sep = File.separator;
	static public String fs = System.getProperty("file.separator");
	static public String ps = System.getProperty("path.separator");	
	
	public static boolean mkdir(String dir){
		  //setup作業用フォルダの作成
		  File work = new File(dir);
		  if(!work.exists())
			  delete(work);
		  boolean b =  work.mkdir();
		  if(b){
//			  System.out.println("create   " + dir + "");
			  Log.finest("create   " + dir + "");
		  }
		  return b;
	}
	public static void copyFile(String srcPath, String destPath) 
    throws IOException {
	//org.apache.commons.io.FileUtils.copyFile(new File(srcPath), new File(destPath));
    
    FileChannel srcChannel = new
        FileInputStream(srcPath).getChannel();
    
    FileChannel destChannel = new
        FileOutputStream(destPath).getChannel();
    
    try {
        srcChannel.transferTo(0, srcChannel.size(), destChannel);
    }finally {
        srcChannel.close();
//        System.out.println(destChannel.size());
        destChannel.close();
    }
    
//    System.out.println("copy " + srcPath + " \t " + destPath);
    if(Config.isStandardOutput)
    	System.out.println("generate " + srcPath + " to " +  destPath);
    Log.finest("copy " + srcPath + " to " + destPath);
    
	}
	
	public static boolean copyDir(String fromPath, String toPath, String type) throws IOException{
		File from = new File(fromPath);
		if(!from.exists() || !from.isDirectory()) 
			return false;
		
		File[] files = from.listFiles();
//		System.out.println(files.length);
		for(int i = 0; i < files.length; i++){
			//System.out.println(files[i].getName()  + type);
			//System.out.println(files[i].getName().matches(".*\\." + type));
			boolean check = files[i].getName().matches(".*\\." + type);
			if(check){
				//System.out.println("copy "+ files[i].getAbsolutePath() + "to " + toPath + files[i].getName());
				Log.finest("copy "+ files[i].getAbsolutePath() + "to " + toPath + files[i].getName());
//				copyFile(files[i].getAbsolutePath(), toPath + "/" +files[i].getName());
				copyFile(files[i].getPath(), toPath  + files[i].getName());
			}
		}
		return false;
		
	}
	
	
	public static void copyDirectory(String srcDir, String destDir, String[] typeList) throws IOException{
		org.apache.commons.io.FileUtils.copyDirectory(new File(srcDir), new File(destDir), (FileFilter) new dojoFileFilter(typeList));
	}
	public static boolean delete(File f){
//		System.out.println("delete " + f.getAbsolutePath());
		  if( f.exists()==false ){
		        return true;
		    }

		    if(f.isFile()){
		        f.delete();
		    }
		    
		    if(f.isDirectory()){
		        File[] files=f.listFiles();
//		        System.out.println(files.length);
		        for(int i=0; i < files.length; i++){
		        	Log.finest("delete"+ files[i].getAbsolutePath());	
		            boolean result = false;
		            while(!result){
		            	 result = delete(files[i]);
//		            	 System.out.println("sleep" + files[i].getName());
		            	 //try {
//							Thread.sleep(100);
//						} catch (InterruptedException e) {
//							e.printStackTrace();
//						}
		            }
		            //System.out.println("delete  "+ files[i].getAbsolutePath() + result);
		        }
		        boolean result = f.delete();
//		        System.out.println("delete   "+ f.getAbsolutePath() + "  " + result);
		        return result;
		    }
			return false;

	}
	
	/**
	 * 作業用ディレクトリを圧縮して、アプリケーションファイルを作成
	 * @param basePath
	 * @param appName
	 * @throws Exception
	 */
	public static void compression(File baseDir,File zipFile) throws Exception{
		
		//File baseDir = new File(basePath);
		//File warFile = new File(appName);
		//File[] files = { new File(basePath)};
		File[] files = { baseDir };
		ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile));
		encode(zos, files, baseDir);
		
		zos.close();
//		System.out.println("make " + appName + "!");
	}

	private static byte[] buf = new byte[1024];
	/**
	 * ファイルのリストを圧縮ファイルに追加、ディレクトリのだった場合は、再帰的に呼び出す
	 * @param zos
	 * @param files
	 * @param baseDir
	 * @throws Exception
	 */
	public static void encode(ZipOutputStream zos, File[] files, File baseDir) throws Exception {
		for (File f : files) {
			boolean check = f.getName().matches("\\..*");//svn や eclipse用の設定ファイルは除く
			
			if (f.isDirectory() && !check) {
				encode(zos, f.listFiles(),baseDir);
			} 
			else if (!check){
				
				ZipEntry ze = new ZipEntry(f.getPath().replace(baseDir.getPath(), "").replace('\\', '/'));
				
//				System.out.println(ze.getName());
				zos.putNextEntry(ze);
				InputStream is = new BufferedInputStream(new FileInputStream(f));
				while(true) {
					int len = is.read(buf);
					if (len < 0) break;
					zos.write(buf, 0, len);
				}
				is.close();
			}
		}
	}
	
	
	public static String read(File file) throws IOException{
		
		InputStreamReader is = new InputStreamReader(new FileInputStream(file), "UTF-8");
		BufferedReader br = new BufferedReader(is);

		String result = br.readLine();
		String line;
		while ((line = br.readLine()) != null) {
				result += "\n" + line;
		}	
        br.close();
        is.close();
		
		return result;
		
		
	}
	
	public static boolean writeFile(String path, String str, boolean isOverWrite) throws FileNotFoundException, UnsupportedEncodingException, IOException{
		
		File file = new File(path);
		file.getParentFile().mkdirs();
		
		if (file.createNewFile() || isOverWrite){
			FileOutputStream fos = new FileOutputStream(file);
			OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
			BufferedWriter bw = new BufferedWriter(osw);
			bw.write(str);
			
			bw.close();
			osw.close();
			fos.close();
			
			return true;
		}
		return false;
		
	}
	
	public static ArrayList<File> findFiles(File dir, String type){
		ArrayList<File> result = new ArrayList<File>();
		
		if(dir.exists() || !dir.isDirectory()){ 
			File[] files = dir.listFiles();
			for(int i = 0; i < files.length; i++){
				if(files[i].isDirectory()){
					result.addAll(findFiles(files[i],type));
				}
				else {
					boolean check = files[i].getName().matches(".*\\." + type);
//					System.out.println(files[i].getAbsolutePath());
					Log.finest(files[i].getAbsolutePath());
//					System.out.println(check);
					if(check){
//						System.out.println("add "+ files[i].getAbsolutePath());
						Log.finest("add "+ files[i].getAbsolutePath());
						result.add(files[i]);
					}
				}
			}
		}
		
		return result;
	}
	
	public static File[] findFiles(String string, String type) {
		File dir = new File(string);
		return 	findFiles(dir, type).toArray(new File[0]);
	}
	
	
	
	public static void main(String[] args) throws IOException {
//		File file = new File("./resources/template/dbtable.template");
//		System.out.println(read(file));
	
//		System.out.println(findFiles("./out/chat/WEB-INF/src/", "java").length);
		System.out.println(System.getProperty("path.separator"));
	}
	
	
}
