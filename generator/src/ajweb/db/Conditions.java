package ajweb.db;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * and or not�Ȃǂ̓���q�ɂȂ����_������\��
 * @author hiroki
 *
 */
public class Conditions extends AbstractCondition {
	public AbstractCondition leftside;
	public AbstractCondition rightside;
	public ArrayList<AbstractCondition> children;
	public String operator;
	
	/**
	 * �R���X�g���N�^ ���Z�q���w��
	 * @param operator AND, OR, NOT�Ȃǂ̕�����
	 */
	public Conditions(String operator){
		this.operator = operator;
		children = new ArrayList<AbstractCondition>();
	}
	
	/**
	 * �_������������
	 * @param child
	 */
	public void add(AbstractCondition child){
		children.add(child);
	}
	public String toString(){
		return null;
	}
	/**
	 * preparedSQL�ɕϊ��A
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
 * preparedSQL�ɒl���Z�b�g�D
 * ��ԍŏ��ɌĂ΂ꂽ�ꍇ�Aindex���P�ɃZ�b�g��setPreparedSQLIndex���Ăяo��
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
 * preparedSQL�ɒl���Z�b�g�D
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
