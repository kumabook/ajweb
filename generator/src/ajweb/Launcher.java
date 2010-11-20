package ajweb;
import ajweb.JarClassLoader;

public class Launcher {

    public static void main(String[] args) {
        JarClassLoader jcl = new JarClassLoader();
        try {
        	jcl.invokeMain(ajweb.generator.Main.class.getCanonicalName(), args);
        } catch (Throwable e) {
            e.printStackTrace();
        }
    } // main()
    
} // class Launcher
