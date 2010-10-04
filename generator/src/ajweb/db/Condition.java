package ajweb.db;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;

/**
 * 条件式を表すクラス
 * @author hiroki
 *
 */
public class Condition extends AbstractCondition {
	
	public String operator;
	public String property;
	public String param;
	
	
	
	/**
	 * コンストラクタ
	 * @param operator
	 * @param property
	 * @param param
	 */
	public Condition(String operator, String property, String param){
		this.operator = operator;
		this.property = property;
		this.param = param;
	
	}
	
	
	public String toString(){
		if(operator.equals("eq") || operator.equals("=") || operator.equals(">") || operator.equals("<") ||
				operator.equals(">=") || operator.equals("<=") ||
				operator.equals("!=") || operator.equals("<>"))
		{
			return property + operatorToSQL(operator) + param;
		}
		
		return "unknown operator";
		
	}
	/**
	 * 条件判定
	 * @param item
	 * @return
	 * @throws Exception
	 */
	public boolean related(HashMap<String, String> item) throws Exception{
		if(this.operator.equals("=") || this.operator.equals("eq")){
			return item.get(this.property).equals(this.param);
		}
		else if (this.operator.equals(">") ){
			return Integer.parseInt(item.get(this.property)) > Integer.parseInt(this.param) ;
		}
		else if (this.operator.equals("<")){
			return Integer.parseInt(item.get(this.property)) < Integer.parseInt(this.param) ;
		}
		else if (this.operator.equals(">=")){
			return Integer.parseInt(item.get(this.property)) > Integer.parseInt(this.param) ;
		}
		else if (this.operator.equals("<=")){
			return Integer.parseInt(item.get(this.property)) < Integer.parseInt(this.param) ;
		}
		else {
			throw new Exception("unsupported condition operator");
			
		}
	}
	
	public String toPreparedSQL(){
		return property  + " "+ operatorToSQL(operator) + " " + "?";
		}

	
	@Override
	public void setPreparedSQL(PreparedStatement st) throws SQLException {
		int index = 1;
		setPreparedSQLIndex(st, index);
	}

	@Override
	protected int setPreparedSQLIndex(PreparedStatement st, int index) throws SQLException {
		st.setString(index, param);
		index = index + 1;
		return index;
	}
	
	static String operatorToSQL(String operator){
		if(operator.equals("eq"))
			return "=";
		else if(operator.equals("noteq"))
			return "!=";	
		else if(operator.equals("gt"))
			return ">";	
		else if(operator.equals("lt"))
			return "<";
		else return "";
		
	}
	
	public String toJSON(){
		
		return "{ op: \""+ operator +  "\", property: \""+ property +"\", value: " + param + " }";
	}


	
}
