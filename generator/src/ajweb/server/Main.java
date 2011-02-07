package ajweb.server;

import java.io.File;
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
		int port = 8080;
		String webappsDir = "webapps";
		boolean isLaunchBrowser = false;
		String appName = null; //app name
		String target = null; //file
		boolean isWar = true; //war ���@�\�[�X�f�B���N�g����

		//�I�v�V�������擾
		for (int i = 0; i < args.length; ++i) {
            if ("-appname".equals(args[i])) {
                appName = args[++i];
            } 
            else if ("-src".equals(args[i])) {//�쐬���ꂽ�A�v���𗧂��グ��   �f�B���N�g���w��
                isWar = false;
                File targetFile = new File(args[++i]);
                if(appName==null)
                	appName = targetFile.getName();
                target = targetFile.getPath();
            } 
            else if ("-war".equals(args[i])) {//�쐬���ꂽ�A�v���𗧂��グ��  war�t�@�C���w��@  
                isWar = true;
                File targetFile = new File(args[++i]);
                appName = targetFile.getName().replaceAll("\\..*", "");;
                target = targetFile.getPath();
            } 
            else if ("-port".equals(args[i])) {
                port = Integer.parseInt(args[++i]);
            }
            else if("-webapps".equals(args[i])){
            	webappsDir = args[++i];
            }
            else if("-browser".equals(args[i])){
            	isLaunchBrowser = true;
            }
            else if ("-help".equals(args[i])){
            	System.err.println("ajweb:�����w��̌��F���m�̈������w�肳��܂���");
            }
		}

		if(appName==null){
			Server.run(port, webappsDir, isLaunchBrowser);
		}

		if(isWar){
			System.out.println("ajweb launch application by War File: " + target +" appName " +  appName + ":" + port);
			ajweb.server.Server.runWar(target, appName, port, isLaunchBrowser);
		}
		else {
			System.out.println("ajweb launch application by Source Folder: " + target +" appName " +  appName + ":" + port);
			ajweb.server.Server.runSource(target, appName, port, isLaunchBrowser);
		}
	}
}
