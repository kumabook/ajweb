package ajweb.server;

import java.awt.Desktop;
import java.io.File;
import java.net.URI;

import ajweb.Config;

/**
 * ajweb�ɑg�ݍ��݂̃T�[�o�𗧂��グ��
 * @author hiroki
 *
 */
public class Main extends Thread{
	static String ajwebHome = ".";
	
	public static void main(String[] args) throws Exception {
		Config.setBaseDir(".");
		//String[]  testArgs = {"chat.war"};
		//args = testArgs;
		int port = 8080;
		String appName = null;
		String target = null; //
		boolean isWar = true; //war ���@�\�[�X�f�B���N�g����
		Boolean isClean = false; // �f�[�^�x�[�X���폜���邩�ǂ���
		if(args.length == 0){
			//System.out.println("ajweb: please input war file!");
			Server.run();
			return;
		}
		else {
//			 target = args[0];
//			appName = new File(target).getName().replaceAll("\\..*", ""); //ajml����applicaiton�̖��O���Ȃ��ꍇ
		}
		//�I�v�V�������擾
		for (int i = 0; i < args.length; ++i) {
            if ("-appname".equals(args[i])) {
                appName = args[++i];
            } 
            else if ("-source".equals(args[i])) {
                isWar = false;
                File targetFile = new File(args[++i]);
                if(appName==null)
                	appName = targetFile.getName();
                target = targetFile.getPath();
                
            } 
            else if ("-war".equals(args[i])) {
                isWar = true;
                File targetFile = new File(args[++i]);
                appName = targetFile.getName().replaceAll("\\..*", "");;
                target = targetFile.getPath();
                
            } 
            else if ("-port".equals(args[i])) {//�쐬���ꂽ�A�v���𗧂��グ��  
                port = Integer.parseInt(args[++i]);
            } 
            else if ("-clean".equals(args[i])) {//�f�[�^�x�[�X���������邩
                isClean = true;
            } 
            else if ("-help".equals(args[i])){
            	System.err.println("ajweb:�����w��̌��F���m�̈������w�肳��܂���");
            }
		}
		

		if(isClean){
			
		}

		if(appName==null){
			File targetFile = new File(args[0]);
			if(targetFile.isDirectory())
				appName = targetFile.getName();
			else {
				appName = targetFile.getName().replaceAll("\\..*", "");
			}
		}
		
		if(target==null){
			target = new File(args[0]).getPath();
		}
		if(isWar)
			System.out.println("ajweb launch application by War File: " + target +" appName " +  appName + ":" + port);
		else 
			System.out.println("ajweb launch application by Source Folder: " + target +" appName " +  appName + ":" + port);
		if(isWar)
			ajweb.server.Server.runWar(target, appName, port);
		else
			ajweb.server.Server.runSource(target, appName, port);
	
		
		System.out.println("access application on browser");
		Desktop desktop = Desktop.getDesktop();
		desktop.browse(new URI("http://localhost:" + port + "/" + appName));	
	}
}
