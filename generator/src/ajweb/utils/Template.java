package ajweb.utils;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import ajweb.Config;
import ajweb.JarClassLoader;

public class Template {
	
	HashMap<String, String> param = new HashMap<String, String>();
	public String source = "";
	
	
	public Template(String templateName) throws IOException {
		
		
		InputStream is = null;
		JarClassLoader jcl = new JarClassLoader();
		if(jcl.isLaunchedFromJar())
			is = getClass().getClassLoader().getResourceAsStream("resources/template/" + templateName + ".template");
		else
			is = new FileInputStream(Config.templateFolder + "/" + templateName + ".template");
		
		
		BufferedReader reader = 
			new BufferedReader(new InputStreamReader(is, "UTF-8"/* 文字コード指定 */));
		StringBuffer buf = new StringBuffer();
		String str = reader.readLine();
		buf.append(str);
		while ((str = reader.readLine()) != null) {
			buf.append("\n");
			buf.append(str);
		}
		source =  buf.toString();

		setParam();
	}
	
	
	private void setParam(){
		
		Pattern pattern = Pattern.compile("\\$\\{(([A-Z]|_)*)\\}");
		Matcher matcher = pattern.matcher(source);
		while(matcher.find()){
			this.param.put(matcher.group(1), null);
		}
	}
	
	public void apply(String key, String value){
		if(this.param.containsKey(key)){

			this.param.put(key, value);
			value = value.replaceAll("\\$", "\\\\\\$");// 置き換える文字列の中の$をエスケープ
			
			Pattern pattern = Pattern.compile("\\$\\{" + key + "\\}");
			Matcher matcher = pattern.matcher(source);
			
			source = matcher.replaceAll(value);// 置き換える文字列の中の$をもとに戻す
			source = source.replaceAll("\\\\\\$","\\$");
			source = source.trim();
		}
	}
	
	public boolean isApplied(String key){
		return param.get(key) != null;
	}
		
/*	public static void main(String[] args) throws IOException {
		
		Template temp = new Template("dbtable");
		temp.apply("TABLENAME" , "chat");
		System.out.println(temp.source);
	}*/
	
}
