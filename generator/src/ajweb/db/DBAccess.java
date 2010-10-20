package ajweb.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;
import java.util.Random;
import java.util.Map.Entry;

import ajweb.utils.Log;

/**
 * �f�[�^�x�[�X�A�N�Z�X�̃��[�e�B���e�B�N���X�B
 * �����h���C�o�A�f�[�^�x�[�X�̃C���X�^���X�͕�������Ȃ������ǂ��H�i�f�b�h���b�N�̉\������j
 * 
 * @author Hiroki Kumamoto
 *
 */
public class DBAccess {
	

	String driverClassName;
	String dbName;
	Connection conn;
	
	
	
	/**
	 * �f�t�H���g�̃R���X�g���N�^<br>
	 * �f�[�^�x�[�X�͑g�ݍ��݂�Apache derby��p����
	 */
	public DBAccess(){
		driverClassName = "org.apache.derby.jdbc.EmbeddedDriver";
		dbName = "jdbc:derby:ajweb_derby";
	}
	/**
	 * �f�[�^�x�[�X�h���C�o�[�A�f�[�^�x�[�X�����w�肷��R���X�g���N�^�B
	 * @param driverClassName �h���C�o�[�̖��O
	 * @param dbName �f�[�^�x�[�X��
	 */
	public DBAccess(String driverClassName, String dbName){
		this.driverClassName = driverClassName;
		this.dbName = dbName;
	}
	
	
		
	
	/**
	 * ajweb���T�|�[�g����f�[�^�^���f�[�^�x�[�X�X�L�[�}�p�̕�����ɕϊ�
	 * @param st
	 * @return
	 */
	public static String getType(String st){
		
		st = st.trim();
		
		if(st.equals("string")){
			return "varchar(100)";
		}
		else if(st.equals("int")){
			return "int";
		}
		else if(st.equals("datetime")){
			return "timestamp";
		}
		
		return st;
	}
	/**
	 * �R�l�N�V�������擾
	 * @return
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	private Connection getConnection() 
		throws InstantiationException, IllegalAccessException, 
		ClassNotFoundException, SQLException{
			Class.forName(driverClassName).newInstance();

			Properties props = new Properties();
			props.put("create", "true");
			if(conn == null)
				 conn = DriverManager.getConnection(dbName,props);//�����̃f�[�^�x�[�X���͐ݒ�
			conn.setAutoCommit(false);
			
			return conn;
	}
	
	
	
	/**
	 * �f�[�^�x�[�X�e�[�u�����쐬
	 * @param tableName �e�[�u����
	 * @param properties �X�L�[�}�̃v���p�e�B�̃n�b�V��(���O�ƃf�[�^�^)
	 * @throws SQLException
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 */
	public void create(String tableName, HashMap<String,String> properties) throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
	
		String sql = "CREATE TABLE " + tableName + "( ";
		
		Iterator<Entry<String, String>> ite = properties.entrySet().iterator();
//		sql += "id int NOT NULL GENERATED ALWAYS AS IDENTITY primary key, ";
		sql += "id int NOT NULL primary key, ";
		while(ite.hasNext()){
			Entry<String, String> e = ite.next();
			sql += e.getKey() + " " + getType(e.getValue());
			if(ite.hasNext()) 
				sql += " ,";
		}
		sql += " )";
		
		Log.finer(sql);

		conn = getConnection();
		Statement st = conn.createStatement();
		st.execute(sql);
		st.close();
		conn.commit();
		close();
		Log.finer("new table '" + tableName + "' created.");

	}
	/**
	 * �f�[�^�x�[�X�e�[�u���̍폜
	 * @param tableName �e�[�u����
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	public void drop(String tableName) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		String sql = "DROP TABLE " + tableName;
		Log.finer(sql);

		conn = getConnection();
		Statement st = conn.createStatement();
		Log.finer(sql);
		
		st.execute(sql);
		st.close();
		conn.commit();
		close();
		Log.finer("drop " + tableName);
		
	}
		
	
	/**
	 * INSERT�������s
	 * @param param
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	
	public HashMap<String, String> insert(String tableName, HashMap<String, String> properties, HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException {

		
		String sql = "INSERT INTO " + tableName + "(";
		String _sql = "";
		Iterator<Entry<String, String>> ite = properties.entrySet().iterator();
		while(ite.hasNext()){
			Entry<String, String> e = ite.next();
			sql += e.getKey();
//			_sql =  "'" + getType(e.getValue()) + "'";
			_sql +=  "?";
			if(ite.hasNext()){ 
				sql += ", ";
				_sql += ", ";
			}
		}
//		sql += ") values(";
		sql += ", id) values(";
		
		Random random = new Random();  
		int ran = random.nextInt(100000);//  
		
//		_sql += "  )";
		_sql += ", ?)";
		sql = sql + _sql;
		
		Log.finer(sql);
		Connection conn;
		
		conn = getConnection();

		Log.finer(sql);
		PreparedStatement st = conn.prepareStatement(sql);
		
		ite = param.entrySet().iterator();
		int index = 1;
		while(ite.hasNext()){
			Entry<String, String> e = ite.next();
//			System.out.println(index + "   " + e.getValue());
			st.setString(index, e.getValue());
			index++;
		}
		
		st.setInt(index, ran);
		
		st.execute();
		st.close();
		conn.commit();
		close();
		
		
		@SuppressWarnings("unchecked")
		HashMap<String, String>result  = (HashMap<String, String>) param.clone();
		result.put("id" , ran+"");
		return result;
			
	}	
		
	/**
	 * update�������s(id�x�[�X�ɕύX����K�v����)
	 * @param tableName
	 * @param properties
	 * @param param
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	public void update(String tableName, HashMap<String, String> properties, HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
	
						
		
		String sql = "UPDATE " + tableName + " SET ";
			
		Iterator<Entry<String, String>> ite = properties.entrySet().iterator();
		while(ite.hasNext()){
			Entry<String, String> e = ite.next();
			sql += e.getKey() + "=?";
				
			if(ite.hasNext()){ 
				sql += ", ";
			}
		}
		//where�߂�id�w��
						
		Connection conn = getConnection();
		Log.finer(sql);

		PreparedStatement st = conn.prepareStatement(sql);
			
		ite = param.entrySet().iterator();
		int index = 1;
		while(ite.hasNext()){
			Entry<String, String> e = ite.next();
			st.setString(index, e.getValue());
			index++;
		}
			
		st.execute();
		st.close();
		conn.commit();
		close();
		
		Log.finer("update " );
	}

			
		
	public  Boolean delete(String tableName, AbstractCondition where) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		Connection conn = getConnection();
		
		PreparedStatement st;
		Boolean rs = false;
		
		
		Log.finer("DELETE  FROM " + tableName + " WHERE " + where.toPreparedSQL());
		st = conn.prepareStatement("DELETE  FROM " + tableName + " WHERE " + where.toPreparedSQL());
		where.setPreparedSQL(st);
				
		rs = st.execute();
		
		
		st.close();
		conn.commit();
		close();
		Log.finest("delete " + tableName + " " + where.toPreparedSQL());
		return rs;
	}
	/**
	 * select�������s
	 * @param tableName
	 * @param properties
	 * @param where
	 * @return
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	public ArrayList<HashMap<String, String>> select(String tableName, HashMap<String, String> properties,  AbstractCondition where) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		Connection conn = getConnection();
		PreparedStatement st;
		ResultSet rs = null;
		ArrayList<HashMap<String, String>> result = new ArrayList<HashMap<String, String>>();
			
		if(where != null){//condision����sql�����쐬
			Log.finer("SELECT * FROM " + tableName + " WHERE " + where.toPreparedSQL());
			st = conn.prepareStatement("SELECT * FROM " + tableName + " WHERE " + where.toPreparedSQL());
			where.setPreparedSQL(st);
		}
		else
			st = conn.prepareStatement("SELECT * FROM " + tableName);
			
			rs = st.executeQuery();
						
			if(rs != null){
				while (rs.next()) {
					HashMap<String, String> data = new HashMap<String, String>();
					data.put("id", rs.getString("id"));
					Iterator<Entry<String, String>> ite = properties.entrySet().iterator();
					while(ite.hasNext()){
						Entry<String, String> en = ite.next();
						data.put(en.getKey(), rs.getString(en.getKey()));
					}
					result.add(data);
				}
				rs.close();
			}
			
			st.close();
			conn.commit();
			close();
			
			return result;
		}
		
		public void close() throws SQLException{
			if(this.conn == null)
				return;
			this.conn.close();
			this.conn = null;
		}
				
}

