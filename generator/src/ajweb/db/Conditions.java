package ajweb.db;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * and or notなどの入れ子になった論理式を表す
 * @author hiroki
 *
 */
public class Conditions extends AbstractCondition {
	public AbstractCondition leftside;
	public AbstractCondition rightside;
	public ArrayList<AbstractCondition> children;
	public String operator;
	
	/**
	 * コンストラクタ 演算子を指定
	 * @param operator AND, OR, NOTなどの文字列
	 */
	public Conditions(String operator){
		this.operator = operator;
		children = new ArrayList<AbstractCondition>();
	}
	
	/**
	 * 論理式を加える
	 * @param child
	 */
	public void add(AbstractCondition child){
		children.add(child);
	}
	public String toString(){
		return null;
	}
	/**
	 * preparedSQLに変換、
	 */
	public String toPreparedSQL(){
		String result = "(";
		for(int i = 0; i < children.size(); i++){
			result += children.get(i).toPreparedSQL();
			if (i != children.size()-1)
				result += " " + operator + " ";
		}
		return result + ")";
		//return "(" + this.leftside.toPreparedSQL() + " " + operator + " " + this.rightside.toPreparedSQL();
		
	}


/**
 * preparedSQLに値をセット．
 * 一番最初に呼ばれた場合、indexを１にセットしsetPreparedSQLIndexを呼び出す
 */
	@Override
	public void setPreparedSQL(PreparedStatement st) throws SQLException {
		int index = 1;
		for(int i = 0; i < children.size(); i++){
			index = children.get(i).setPreparedSQLIndex(st, index);
		}
		//index = leftside.setPreparedSQLIndex(st, index);
		//index = rightside.setPreparedSQLIndex(st, index);
	}


/**
 * preparedSQLに値をセット．
 */
	@Override
	protected int setPreparedSQLIndex(PreparedStatement st, int index) throws SQLException {
			for(int i = 0; i < children.size(); i++){
				index = children.get(i).setPreparedSQLIndex(st, index);
			}
		//int result = leftside.setPreparedSQLIndex(st, index);
		//return rightside.setPreparedSQLIndex(st, result);
		return index;
	}


	@Override
	public boolean related(HashMap<String, String> item) throws Exception {
		if(operator.equals("and")){
			for(int i = 0; i < children.size(); i++){
				if(!children.get(i).related(item))
					return false;
			}
			return true;
		}
		else if(operator.equals("or")){
			for(int i = 0; i < children.size(); i++){
				if(children.get(i).related(item))
					return true;
			}
			return false;
		}
		else if(operator.equals("not")){
			return !children.get(0).related(item);
		}
		throw new Exception("unexpected condition operator");
	}
	
}
