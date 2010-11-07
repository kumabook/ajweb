package ajweb.db;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.eclipse.jetty.util.ajax.JSON;
/**
 * データベースへの変更を表すクラス
 * @author hiroki
 *
 */
public class Modification {
	public String tablename;
	public String type;
	public HashMap<String, String> item;
	/**
	 * コンストラクタ
	 * @param tablename　データベーステーブル名
	 * @param type	変更の種類, insert, update, deleteのいずれか
	 * @param item 変更の内容
	 */
	public Modification(String tablename, String type, HashMap<String, String> item){
		this.tablename = tablename;
		this.type = type;
		this.item = item;
	}
	/**
	 * json文字列からModificationに変換
	 * @param json
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static Modification parse(String json){
		HashMap<String, ?> obj = (HashMap<String, ?>) JSON.parse(json);
		HashMap<String, String> param = new HashMap<String, String>();
		HashMap<String, ?>  _param = (HashMap<String, ?>) obj.get("param");
		Iterator<String> ite = _param.keySet().iterator();
		while(ite.hasNext()){
			String key = ite.next();
			param.put(key, _param.get(key).toString());
		}
		return new Modification((String) obj.get("action"), (String) obj.get("table"), param);
	}
	/**
	 * json形式に変換、クライアントに通知するため
	 * @param modifications
	 * @return
	 */
	public static String toJSON(ArrayList<Modification> modifications){
		String result = "[";
		for(int i = 0; i < modifications.size(); i++ ){
			if(i != 0)
				result += ",";
			result += toJSON(modifications.get(i));
			
		}
		return result + "]";
		
	}
	/**
	 * json形式に変換、クライアントに通知するため
	 * @param modifications
	 * @return
	 */
	public static String toJSON(Modification modification){
		return "{ action : \"" + modification.type + "\" ,table: \"" + modification.tablename + "\", item: " + JSON.toString(modification.item) + "} "; 
	}
}
