package ajweb.editor;

import ajweb.server.Server;


public class Main {
	public static void main(String[] args) throws Exception {
         //editor.war‚ğì¬
		
 //      FileUtils.compression("../editor/", "editor.war");
		//System.out.println("create editor.war");
		
         Server.runSource(".", "editor", 1234);
         
     }
 }
