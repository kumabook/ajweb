package ajweb.parser;

import java.util.ArrayList;



public abstract class HandlerFactory {

	public abstract AbstractHandler create();
	
	public static String handleType(String qName){
		//ウィジェットの定義は外部から読み込む
		//とりあえずの実装
		if(widgets.contains(qName)){
			return "widget";
		}
		else if(containers.contains(qName)){
			return "window";
		}
			
		return qName ;
		
	}
	
	public static ArrayList<String> widgets = new ArrayList<String>();
	static {
		widgets.add("button");
		widgets.add("table");
		widgets.add("label");
		widgets.add("textbox");
		widgets.add("select");
		widgets.add("panel");
		widgets.add("frame");
	}
	
	public static ArrayList<String> containers = new ArrayList<String>();
	static {
		containers.add("panel");
		containers.add("frame");
		containers.add("dialog");
	}
	
	public static ArrayList<String> acceptanceElements(String elemName){
		ArrayList<String> result = new ArrayList<String>();
		String[] list = {};
		if(elemName.equals("application")){//外部から取得
			String[] _list = {"interfaces", "databases", "events"};
			list = _list;
		}
		else if(elemName.equals("interfaces")){//外部から取得
			String[] _list = {"frame"};
			list = _list;
		}
		
		else if(elemName.equals("events")){//外部から取得
			String[] _list = {"event"};
			list = _list;
		}
		else if(elemName.equals("databases")){//外部から取得
			String[] _list = {"database"};
			list = _list;
		}
		
		
		
		
		for(int i = 0; i < list.length; i++){
			result.add(list[i]);
		}
		if(result.size() == 0)
			result.addAll(widgets);
		//result.add("widget");
		
		return result;
		
	}
}
