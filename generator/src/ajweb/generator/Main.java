package ajweb.generator;

import ajweb.Config;
import java.io.*;
import java.util.logging.Logger;

/***
 * ajweb generator �̎��s�N���X
 * @author hiroki
 *
 */

public class Main {
	
	public static String workDirectory = Config.workDir;
	public static String appName;
	public static Logger logger;
	
	
	static public String fs = Config.fs;
	static public String ps = Config.ps;
	
	/**
	 * ���C�����\�b�h�B<br/>
	 * 
	 * 
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		//System.setProperty("ajweb.work",".ajweb" + ajweb.generator.Main.fs + "runtime");
		String ajml;
		File ajmlFile;
		Boolean isWar = true; //�\�[�X�̂܂܂𐶐����邩
		String out = null; //
		if(args.length == 0){
			System.out.println("ajmlc: please input ajml file!");
			return;
		}
		else {
			ajml = args[0];
			ajmlFile = new File(ajml);
			appName = new File(ajml).getName().replaceAll("\\..*", ""); //ajml����applicaiton�̖��O���Ȃ��ꍇ
		}
		//�I�v�V�������擾
		for (int i = 1; i < args.length; ++i) {
            if ("-appname".equals(args[i])) {
                appName = args[++i];
            } 
            else if ("-source".equals(args[i])) {
                isWar = false;
                out = args[++i];
            }
            else if ("-war".equals(args[i])) {
                isWar = true;
                out = args[++i];
            }
            else if ("-help".equals(args[i])){
            	System.err.println("ajmlc:�����w��̌��F���m�̈������w�肳��܂���");
            }
		}
		
		if(isWar){
			if(out == null)
				out = appName + ".war";			
			File warFile = new File(out);
			Compiler.generateWar(ajmlFile, warFile);
		}
		else {
			if(out == null)
				out = appName;
			//File sourceDir = new File(out);
			Compiler.generateSource(ajmlFile, out);
		}
		
//		System.out.println("ajml : "  + ajml + ",  appName : " + appName);
	}
	
}