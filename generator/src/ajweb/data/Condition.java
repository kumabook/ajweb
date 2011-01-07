package ajweb.data;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

/**
 * ��������\���N���X
 * @author hiroki
 *
 */
public class Condition extends AbstractCondition {
	
	
	public static ArrayList<String> operators = new ArrayList<String>();
	static {
		operators.add("eq");
		operators.add("neq");
		operators.add("gt");
		operators.add("gte");
		operators.add("lt");
		operators.add("lte");
		operators.add("not");
		operators.add("and");
		operators.add("or");
	}
	
	public String operator;
	public String property;
	public String value;
	
	
	
	/**
	 * �R���X�g���N�^
	 * @param operator
	 * @param property �ΏۂƂȂ�f�[�^�x�[�X�̃J������
	 * @param param ��r���鑊��
	 */
	public Condition(String operator, String property, String param){
		this.operator = operator;
		this.property = property;
		this.value = param;
	
	}
	
	/**
	 * 1���R�[�h�̓��e�������ɂƂ����������s��
	 * @param item ���R�[�h�̓��e
	 * @return ���������������邩
	 * @throws Exception
	 */
	
	public boolean related(HashMap<String, String> item, HashMap<String,String> properties) throws Exception{
		System.out.println(this.property);
		System.out.println(properties);
		String propertyType = properties.get(this.property);
		long value = 0;
		long item_value = 0;
		boolean long_flag = false;
		
		if(propertyType.equals("datetime") || propertyType.equals("date") || propertyType.equals("time")){//������𐔒l�ɕϊ�
			//System.out.println(item.get(this.property));
			Date date = new Date(this.value);
			value = date.getTime();
			Date item_date = new Date(item.get(this.property));
			item_value = item_date.getTime();
			
			long_flag = true;
		}
		
		if(propertyType.equals("int")){
			value = Long.parseLong(this.value);
			System.out.println(this.property);
			item_value = Long.parseLong((item.get(this.property)));
			
			long_flag = true;
		}
		if(long_flag){//���l�Ŕ�r
			
			if(this.operator.equals("=") || this.operator.equals("eq")){
				//return item.get(this.property).equals(this.value);
				return item_value == value;
			}
			else if (this.operator.equals(">") || this.operator.equals("gt")){
				//return Integer.parseInt(item.get(this.property)) > Integer.parseInt(this.value) ;
				return item_value > value;
			}
			else if (this.operator.equals("<") || this.operator.equals("lt")){
				return item_value < value;
				//return Integer.parseInt(item.get(this.property)) < Integer.parseInt(this.value) ;
			}
			else if (this.operator.equals(">=")|| this.operator.equals("gte")){
				return item_value >= value;
				//return Integer.parseInt(item.get(this.property)) > Integer.parseInt(this.value) ;
			}
			else if (this.operator.equals("<=")|| this.operator.equals("lte")){
				return item_value <= value;
				//return Integer.parseInt(item.get(this.property)) < Integer.parseInt(this.value) ;
			}
			else {
				throw new Exception("unsupported condition operator: " + this.operator);
			}
		}
		else {//������Ŕ�r
			if(this.operator.equals("=") || this.operator.equals("eq")){
				//return item.get(this.property).equals(this.value);
				return item.get(this.property).equals(this.value);
			}
			else {
				throw new Exception("unsupported condition operator: " + this.operator);
			}
		}
	}
	/**
	 * PreparedSQL�ɕϊ�
	 */
	@Override
	protected String toPreparedSQL(){
		return property  + " "+ operatorToSQL(operator) + " " + "?";
		}

	/**
	 * �ϊ�����PreparedSQL�ɒl��������B
	 */
	@Override
	protected void setPreparedSQL(PreparedStatement st) throws SQLException {
		int index = 1;
		setPreparedSQLIndex(st, index);
	}

	@Override
	protected int setPreparedSQLIndex(PreparedStatement st, int index) throws SQLException {
		st.setString(index, value);
		index = index + 1;
		return index;
	}
	/**
	 * operator��SQL�p�̕�����ɕϊ�
	 * @param operator
	 * @return
	 */
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
		
		return "{ op: \""+ operator +  "\", property: \""+ property +"\", value: " + value + " }";
	}
	
/**
 * json�`���̕����񂩂�A�N�V������condition�̔z��̃n�b�V���I�u�W�F�N�g�𐶐�
 * @param json
 * @return
 */
	@SuppressWarnings("unchecked")
	static public HashMap<String, ArrayList<AbstractCondition>> parse(String json){
		//HashMap<String, ArrayList<?>> tableConditions = (HashMap<String, ArrayList<?>>) org.eclipse.jetty.util.ajax.JSON.parse(json);
		HashMap<String, Object[]> tableConditions = (HashMap<String, Object[]>) org.eclipse.jetty.util.ajax.JSON.parse(json);
		
		return parse(tableConditions);
		
	}
	
	
	static protected HashMap<String, ArrayList<AbstractCondition>>  parse(HashMap<String, Object[]> _tableConditions){
		HashMap<String, ArrayList<AbstractCondition>> tableConditions  = new HashMap<String, ArrayList<AbstractCondition>>();
		Iterator<String> ite = _tableConditions.keySet().iterator();
		while(ite.hasNext()){
			String key = ite.next();
			Object[] _conditions = _tableConditions.get(key);
			ArrayList<AbstractCondition> conditions = parse(_conditions);
			tableConditions.put(key, conditions);
			//ArrayList<HashMap<String, ?>> conditions = (ArrayList<HashMap<String, ?>>) obj.get(key);
		}
		return tableConditions;
	}

	static protected ArrayList<AbstractCondition> parse(Object[] _conditions){
		ArrayList<AbstractCondition> conditions = new ArrayList<AbstractCondition>();
		for(int i = 0; i < _conditions.length; i++){
			conditions.add(_parse((HashMap<?, ?>) _conditions[i]));
		}
		return conditions;
	}

	static protected AbstractCondition _parse(String json){
		HashMap<?, ?> obj = (HashMap<?, ?>) org.eclipse.jetty.util.ajax.JSON.parse(json);
		return _parse(obj);
	}

	static protected AbstractCondition _parse(HashMap<?, ?> obj){
		String op = (String) obj.get("op");
		if(op.equals("and") || op.equals("or")){
			Conditions cons = new Conditions(op);
		AbstractCondition left = _parse((HashMap<?, ?>) obj.get("left")); 
		AbstractCondition right = _parse((HashMap<?, ?>) obj.get("right"));
		cons.add(left);
		cons.add(right);
		return cons;
		}
		else if(op.equals("not")){
			Conditions cons = new Conditions(op);
			AbstractCondition operand = _parse((HashMap<?, ?>) obj.get("operand"));
			cons.add(operand);
			return cons;
		}
		else {
			
			return new Condition(op, (String) obj.get("property").toString(), (String) obj.get("value").toString());
		}
	}

	public String toString(){
		if(this.operator == null)
			return "{}";
		if(operator.equals("eq") || operator.equals("=") || operator.equals(">") || operator.equals("<") ||
				operator.equals(">=") || operator.equals("<=") ||
				operator.equals("!=") || operator.equals("<>"))
		{
			return property + operatorToSQL(operator) + value;
		}
		
		return "unknown operator";
		
	}
}
