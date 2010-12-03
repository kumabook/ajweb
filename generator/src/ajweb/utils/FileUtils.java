package ajweb.utils;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.URL;
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
		  boolean b =  work.mkdirs();
		  if(b){
//			  System.out.println("create   " + dir + "");
			  Log.finest("create   " + dir + "");
		  }
		  return b;
	}
	
	public static void copyJar(URL url, String file) throws UnsupportedEncodingException, IOException{
		InputStream in = url.openStream();
		FileOutputStream os = new FileOutputStream(file);
		int bufferSize = 100;
		int len = -1;
	    byte[] b = new byte[bufferSize * 1024];
	    try {
	        while ((len = in.read(b, 0, b.length)) != -1) {
	            os.write(b, 0, len);
	        }
	        os.flush();
	    } finally {
	        if (in != null) {
	            try {
	                in.close();
	            } catch (IOException e) {
	                e.printStackTrace();
	            }
	        }
	        if (os != null) {
	            try {
	                os.close();
	            } catch (IOException e) {
	                e.printStackTrace();
	            }
	        }
	    }
		
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
        destChannel.close();
    }
    
    	
    Config.out.println("generate " + srcPath + " to " +  destPath);
    Log.finest("copy " + srcPath + " to " + destPath);
    
	}
	
	
	
	public static boolean copyDir(String fromPath, String toPath, String type) throws IOException{
		File from = new File(fromPath);
		if(!from.exists() || !from.isDirectory()) 
			return false;
		
		File[] files = from.listFiles();
		for(int i = 0; i < files.length; i++){
			boolean check = files[i].getName().matches(".*\\." + type);
			if(check){
				Log.finest("copy "+ files[i].getAbsolutePath() + "to " + toPath + files[i].getName());
				copyFile(files[i].getPath(), toPath  + files[i].getName());
			}
		}
		return false;
		
	}
	
	
	
	public static boolean delete(File f){
		  if( f.exists()==false ){
		        return true;
		    }

		    if(f.isFile()){
		        f.delete();
		    }
		    
		    if(f.isDirectory()){
		        File[] files=f.listFiles();
		        for(int i=0; i < files.length; i++){
		        	Log.finest("delete"+ files[i].getAbsolutePath());	
//		            boolean result = false;
//		            while(!result){
//		            	 result = 
		            		 delete(files[i]);
//		            }
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
		
		File[] files = { baseDir };
		ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile));
		encode(zos, files, baseDir);
		
		zos.close();
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
		InputStream is = null;
		try {
			is = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			System.out.println(file.getPath());
			URL url = file.getClass().getClassLoader().getResource(file.getPath());
			System.out.println(url);
			is = url.openStream();
		}
		
		BufferedReader reader = 
			new BufferedReader(new InputStreamReader(is, "UTF-8"/* 文字コード指定 */));
		StringBuffer buf = new StringBuffer();
		String str = reader.readLine();
		buf.append(str);
		while ((str = reader.readLine()) != null) {
			buf.append("\n");
			buf.append(str);
		}
		
		return buf.toString();
		
		
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
					Log.finest(files[i].getAbsolutePath());
					if(check){
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

}
