package ajweb.model;


import java.util.ArrayList;
import java.util.HashMap;


import ajweb.db.Condition;
import ajweb.utils.JSON;



public class Action implements Expression{
	public String id;
	public String type;
	public String name;
	public String table;
	public Condition condition;
	public HashMap<String, Object> param = new HashMap<String, Object>();
	public ArrayList<Expression> params = new ArrayList<Expression>();
	
	public String jsCode() {
		
		String str = "";
		
		if(type.equals("javascript")){
			String params_js = "";
			
			/*for(int i = 0; i < params.size(); i++){
				if(i != 0 ) str += ",";
				Primitive param_pri = (Primitive) params.get(i);
				params_js += param_pri.toJSON();
			}
//			System.out.println(params_js);
			return "\t" + name + "(" + params_js + ");\n";*/
			return "\t" + name + "(" + JSON.toString(param) + ");\n"; 
		}
		else if(type.equals("db")){
			if(name.equals("store")){//observe‚É‚·‚éH
				str = "var " + id + "= new ajweb.data.store({id :\"" + id + "\", table: \"" +
				table + "\", url: \"" + id + "\", param: {}})\n" ;
				str += "ajweb.stores.push(" + id + ")\n";
			
				//			str += "ajweb.join({id :\"" + id + "\", table: \"" + table + "\", url: \"dbservlet\", param: {}})\n" ;
				Application.isPolling = true;
			
			}
			else if(name.equals("insert") || name.equals("update")){
				//			System.out.println(JSON.toString(param));
//				System.out.println(name + param);
				str += "\t\tajweb.send(\"dbservlet\", \"" + table + "\", \"" + name + "\", " + JSON.toString(param) + ");\n"; 
			}
			else if(name.equals("select") || name.equals("delete") ){
				//			System.out.println(JSON.toString(param));
//				System.out.println(name + param);
				str += "\t\tajweb.send(\"dbservlet\", \"" + table + "\", \"" + name + "\", "  + condition.toJSON() + ");\n"; 
			}
			
		}
		else if(type.equals("bind")){
			return param.get("input") + " = " + param.get("to") + ";\n"; 
		}
				
		
		return str;
	}
	@Override
	public String toString() {
		
		if(type.equals("javascript")){
			return name + "(" + JSON.toString(param) + ")"; 
		}
		else if(type.equals("bind")){
			
			return param.get("input") + " = " + param.get("to"); 
		}
		return "action:" + id + " " + type + " " + name + " " + " " + table+ " " + param;
	}
}
