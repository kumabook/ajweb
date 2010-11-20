package ajweb.utils;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import ajweb.Config;

public class Template {
	
	HashMap<String, String> param = new HashMap<String, String>();
	public String source = "";
	
	
	public Template(String templateName) throws IOException {
		
		InputStream is = null;
		try {
			is = new FileInputStream(Config.templateFolder + templateName + ".template");
		} catch (FileNotFoundException e) {
				is = getClass().getClassLoader().getResourceAsStream("resources/template/" + templateName + ".template");
		}
		
		BufferedReader reader = 
			new BufferedReader(new InputStreamReader(is, "UTF-8"/* �����R�[�h�w�� */));
		StringBuffer buf = new StringBuffer();
		String str = reader.readLine();
		buf.append(str);
		while ((str = reader.readLine()) != null) {
			buf.append("\n");
			buf.append(str);
		}
		source =  buf.toString();
		//if(Config.isJar)
			//URL =*/ 
//		File template = new File(Config.templateFolder + templateName + ".template");
//		source = FileUtils.read("resources/template/" + templateName + ".template");
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
			
			value = value.replaceAll("\\$", "\\\\\\$");// �u�������镶����̒���$���G�X�P�[�v
			
			Pattern pattern = Pattern.compile("\\$\\{" + key + "\\}");
			Matcher matcher = pattern.matcher(source);
			
			source = matcher.replaceAll(value);// �u�������镶����̒���$�����Ƃɖ߂�
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
