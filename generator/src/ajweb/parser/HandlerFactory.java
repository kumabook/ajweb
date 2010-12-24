package ajweb.parser;

import java.util.ArrayList;

import ajweb.model.Action;
import ajweb.model.Call;
import ajweb.model.Condition;
import ajweb.model.Get;
import ajweb.model.Primitive;
import ajweb.model.Widget;



public abstract class HandlerFactory {

	public abstract AbstractHandler create();
	
	public static String handleType(String qName){
		//ウィジェットの定義は外部から読み込む
		//とりあえずの実装
		if(Widget.widgets.contains(qName)){
			return "widget";
		}
		else if(Get.elements.contains(qName)){
			return "get";
		}
		else if(Call.elements.contains(qName)){
			return "call";
		}
		else if(Primitive.elements.contains(qName)){
			return "primitive";
		}
		else if(Condition.elements.contains(qName)){
			return "predicate";
		}
		else if(Action.elements.contains(qName)){
			return "action";
		}
		else if(qName.equals("paramCondition"))
			return "condition";
		return qName;		
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
			result.addAll(Widget.widgets);
		//result.add("widget");
		
		return result;
		
	}
}
