package ajweb.utils;

import java.io.File;
import java.io.FileFilter;


public class dojoFileFilter implements FileFilter {
	private String[] typeList;
	dojoFileFilter(String[] typeList){
		this.typeList = typeList;
	}
	public boolean accept(File dir, String name) {
		boolean result = false;
		for(int i = 0; i < typeList.length; i++){
			name.matches(".*\\." + typeList[i]);
			if(result)
				return true;
		}
		return false;
	}
	@Override
	public boolean accept(File pathname) {
//		System.out.println(pathname.getName());
		if(pathname.isDirectory()) return true;
		boolean result = false;
		for(int i = 0; i < typeList.length; i++){
			result = pathname.getName().matches(".*\\." + typeList[i]);
			if(result)
				return true;
		}
		return false;
	}

}
