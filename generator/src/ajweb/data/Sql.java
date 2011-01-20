package ajweb.data;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
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
 * データベースアクセスのユーティリティクラス。
 * 同じドライバ、データベースのインスタンスは複数つくらない方が良い？（デッドロックの可能性あり）
 * 
 * @author Hiroki Kumamoto
 *
 */
public class Sql {
	

	String driverClassName;
	String dbName;
	Connection conn;
	
	
	
	/**
	 * デフォルトのコンストラクタ<br>
	 * データベースは組み込みのApache derbyを用いる
	 */
	public Sql(){
		driverClassName = "org.apache.derby.jdbc.EmbeddedDriver";
		dbName = "jdbc:derby:ajweb_derby";
	}
	/**
	 * データベースドライバー、データベース名を指定するコンストラクタ。
	 * @param driverClassName ドライバーの名前
	 * @param dbName データベース名
	 */
	public Sql(String driverClassName, String dbName){
		this.driverClassName = driverClassName;
		this.dbName = dbName;
	}
	
	
		
	
	/**
	 * ajwebがサポートするデータ型をデータベーススキーマ用の文字列に変換
	 * @param st
	 * @return
	 */
	public static String getType(String st){
		
		st = st.trim();
		
		if(st.equals("string")){
			return "varchar(100)";
		}
		else if(st.equals("password")){
			return "varchar(100)";
		}
		else if(st.equals("int")){
			return "int";
		}
		else if(st.equals("datetime")){
			return "timestamp";
		}
		else if(st.equals("date")){
			return "date";
		}
		else if(st.equals("time")){
			return "time";
		}
		else if(st.equals("text")){
			return "varchar(1000)";
		}
		
		return st;
	}
	
	public static String encryption(String st) throws NoSuchAlgorithmException{
		byte[] _bytes = st.getBytes();
		MessageDigest md = MessageDigest.getInstance("MD5");
		md.update(_bytes);
		
		byte[] bytes = md.digest();
		
		StringBuffer hexString = new StringBuffer();  
		for (int i = 0; i < bytes.length; i++) {  
			if ((0xff & bytes[i]) < 0x10) {  
				hexString.append("0" + Integer.toHexString((0xFF & bytes[i])));  
			} else {  
				hexString.append(Integer.toHexString(0xFF & bytes[i]));  
			}  
		}  
		return hexString.toString();
	}
	
	/**
	 * コネクションを取得
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
			if(conn == null){
//				boolean isSuccess = false;
//				while(!isSuccess){
//					try{
						conn = DriverManager.getConnection(dbName,props);//ここのデータベース名は設定
//						isSuccess = true;
//					} catch (SQLException e){
//						System.out.println("もう一回");
//						isSuccess = false;
//					}
//				}
			}
			conn.setAutoCommit(false);
			
			
			return conn;
	}
	
	
	
	/**
	 * データベーステーブルを作成
	 * @param tableName テーブル名
	 * @param properties スキーマのプロパティのハッシュ(名前とデータ型)
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
	 * 主キーカラムを指定してデータベーステーブルを作成
	 * @param tableName テーブル名
	 * @param properties スキーマのプロパティのハッシュ(名前とデータ型)
	 * @throws SQLException
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 */
	public void create(String tableName, HashMap<String,String> properties, ArrayList<String> idProperties) throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException{
	
		String sql = "CREATE TABLE " + tableName + "( ";
		
		Iterator<Entry<String, String>> ite = properties.entrySet().iterator();
//		sql += "id int NOT NULL GENERATED ALWAYS AS IDENTITY primary key, ";
		sql += "id int NOT NULL primary key, ";
		//sql += "id int NOT NULL , ";
		while(ite.hasNext()){
			Entry<String, String> e = ite.next();
			if(idProperties.contains(e.getKey())){
				sql += e.getKey() + " " + getType(e.getValue()) + " NOT NULL UNIQUE";
			}
			else 
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
	 * データベーステーブルの削除
	 * @param tableName テーブル名
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
	 * INSERT文を実行(idを自動的に付加)
	 * @param param
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	
	public HashMap<String, String> insert(String tableName, HashMap<String, String> properties, HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException,SQLException{

		
		String sql = "INSERT INTO " + tableName + "(";
		String _sql = "";
		Iterator<Entry<String, String>> ite = param.entrySet().iterator();//properties.entrySet().iterator(); paramならnullをゆるす、propertiesならゆるさない
		while(ite.hasNext()){
			Entry<String, String> e = ite.next();
			if(!e.getKey().equals("id")){
				sql += e.getKey();
//				_sql =  "'" + getType(e.getValue()) + "'";
				_sql +=  "?";
				if(ite.hasNext()){ 
					sql += ", ";
					_sql += ", ";
				}
			}
		}
//		sql += ") values(";
		sql += ", id) values(";
		
		Random random = new Random();
		int ran;
		if(properties.containsKey("id"))
			ran = Integer.parseInt(properties.get("id"));
		else 
			ran = random.nextInt(100000);//  
		
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
			if(!e.getKey().equals("id")){
//				System.out.println(index + "   " + e.getValue());
				st.setString(index, e.getValue());
				index++;
			}
		}
		
		st.setInt(index, ran);
		try {
			int result = st.executeUpdate();
			//System.out.println(result);
			if(result == 0)
				return null;
			st.close();
			conn.commit();
			close();

			@SuppressWarnings("unchecked")
			HashMap<String, String> item  = (HashMap<String, String>) param.clone();
			item.put("id" , ran+"");
			return item;
		} catch (SQLException e){
			st.close();
			close();
			return null;
		}
	}	
			
	
	/**
	 * update文を実行(idベースに変更する必要あり)
	 * @param tableName
	 * @param properties
	 * @param param
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	public HashMap<String, String> update(String tableName, HashMap<String, String> properties, HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
System.out.println(param);
		String sql = "UPDATE " + tableName + " SET ";
			
		
						
		Connection conn = getConnection();
		Log.finer(sql);
	

		Iterator<Entry<String, String>> ite = properties.entrySet().iterator();
		while(ite.hasNext()){
			Entry<String, String> e = ite.next();
			System.out.println(e.getKey() + "  " +e.getValue() + " " + param.get(e.getKey()));
			sql += e.getKey() + "=?";
				
			if(ite.hasNext()){ 
				sql += ", ";
			}
			else {
				sql += " WHERE id=?";
			}
		
		}
		
		PreparedStatement st = conn.prepareStatement(sql);		//where節でid指定
		//ite = param.entrySet().iterator();
		ite = properties.entrySet().iterator();
		int index = 1;
		while(ite.hasNext()){
			Entry<String, String> e = ite.next();
			System.out.println(e.getKey() + "  " +e.getValue() + " " + param.get(e.getKey()));
			st.setString(index, param.get(e.getKey()));
			//st.setString(index, e.getValue());
			index++;
		}
		st.setString(index, param.get("id"));
		
		try{
			int result = st.executeUpdate();
			//System.out.println(result);
			if(result == 0)
				return null;
			
			st.close();
			conn.commit();
			close();
		
			Log.finer("update " );
			return param;
		} catch (SQLException e){
			st.close();
			close();
			return null;
		}
	}
	public HashMap<String, String> delete(String tableName, HashMap<String, String> properties, HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		Condition where = new Condition("eq", "id", param.get("id"));
		ArrayList<HashMap<String, String>> items = select(tableName, properties, where); //
		if(items.size() != 1)
			return null;
				
		Connection conn = getConnection();
		
		PreparedStatement st;
	
		Log.finer("DELETE  FROM " + tableName + " WHERE " + where.toPreparedSQL());
		st = conn.prepareStatement("DELETE  FROM " + tableName + " WHERE " + where.toPreparedSQL());
		where.setPreparedSQL(st);
		
		try{
			int result = st.executeUpdate();
			System.out.println(result);
			if(result == 0)
				return null;
			st.close();
			conn.commit();
			close();
			Log.finest("delete " + tableName + " " + where.toPreparedSQL());
			return items.get(0);
		} catch (SQLException e){
			st.close();
			close();
			return null;
		}
	}
	
	public Boolean delete(String tableName, AbstractCondition where) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		Connection conn = getConnection();
		
		PreparedStatement st;
		
		Log.finer("DELETE  FROM " + tableName + " WHERE " + where.toPreparedSQL());
		st = conn.prepareStatement("DELETE  FROM " + tableName + " WHERE " + where.toPreparedSQL());
		where.setPreparedSQL(st);
		
		int result = st.executeUpdate();
		
		st.close();
		conn.commit();
		close();
		Log.finest("delete " + tableName + " " + where.toPreparedSQL());
		if(result == 0)
			return false;
		else 
			return true;
	}
	/**
	 * select文を実行
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
			
		if(where != null){//condisionからsql文を作成
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
	/**
	 * param中のidPropertyのキーの値で検索をかけ，
	 * その結果が残りのparamのキーに対応する値とすべて等しければtrue,でなければfalseを返す．
	 * @param tableName
	 * @param idProperty
	 * @param id
	 * @param checkedProperty
	 * @param checkedValue
	 * @return
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	public boolean check(String tableName, HashMap<String, String> properties, HashMap<String, String> param) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		@SuppressWarnings("unchecked")
		HashMap<String, String> clone = (HashMap<String, String>) param.clone();
		String idProperty = clone.remove("idProperty");
		Condition con = new Condition("eq", idProperty, clone.get(idProperty));
		ArrayList<HashMap<String, String>> result = select(tableName, properties, con);

		if(result.size() == 1){// && result.get(0).containsKey(checkedProperty)){
			Iterator<String> ite = clone.keySet().iterator();
			while(ite.hasNext()){
				String key = ite.next();
				if(!result.get(0).get(key).equals(clone.get(key)))
						return false;
			}
			return true;
		}
		else 
			return false;
	}
	public boolean check(String tableName, HashMap<String, String> properties, AbstractCondition condition) throws InstantiationException, IllegalAccessException, ClassNotFoundException, SQLException{
		ArrayList<HashMap<String, String>> result = select(tableName, properties, condition);
		if(result.size() >= 1){
			return true;
		}
		else 
			return false;
	}
	/**
	 * コネクションを閉じる、
	 * @throws SQLException
	 */
	public void close() throws SQLException{
		if(this.conn == null)
			return;
		this.conn.close();
		this.conn = null;
	}
				
}

