
package ajweb.editor;


import ajweb.server.Server;
import ajweb.utils.FileUtils;



public class Main {
	public static void main(String[] args) throws Exception {
         //editor.war���쐬
		
 //      FileUtils.compression("../editor/", "editor.war");
		//System.out.println("create editor.war");
		
         Server.runSource(".", "editor");
         
     }
 }
