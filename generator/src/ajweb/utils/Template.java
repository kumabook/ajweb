package ajweb.utils;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import ajweb.Config;

public class Template {
	
	HashMap<String, String> param = new HashMap<String, String>();
	public String source = "";
	
	
	public Template(String templateName) throws IOException{
		File template = new File(Config.templateFolder + templateName + ".template");
		source = FileUtils.read(template);
		setParam();
	}
	
	
	private void setParam(){
		
		Pattern pattern = Pattern.compile("\\$\\{([A-Z]*)\\}");
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
