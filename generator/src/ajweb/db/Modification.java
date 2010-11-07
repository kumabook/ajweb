package ajweb.db;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.eclipse.jetty.util.ajax.JSON;
/**
 * �f�[�^�x�[�X�ւ̕ύX��\���N���X
 * @author hiroki
 *
 */
public class Modification {
	public String tablename;
	public String type;
	public HashMap<String, String> item;
	/**
	 * �R���X�g���N�^
	 * @param tablename�@�f�[�^�x�[�X�e�[�u����
	 * @param type	�ύX�̎��, insert, update, delete�̂����ꂩ
	 * @param item �ύX�̓��e
	 */
	public Modification(String tablename, String type, HashMap<String, String> item){
		this.tablename = tablename;
		this.type = type;
		this.item = item;
	}
	/**
	 * json�����񂩂�Modification�ɕϊ�
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
	 * json�`���ɕϊ��A�N���C�A���g�ɒʒm���邽��
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
	 * json�`���ɕϊ��A�N���C�A���g�ɒʒm���邽��
	 * @param modifications
	 * @return
	 */
	public static String toJSON(Modification modification){
		return "{ action : \"" + modification.type + "\" ,table: \"" + modification.tablename + "\", item: " + JSON.toString(modification.item) + "} "; 
	}
}
