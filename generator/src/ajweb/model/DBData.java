package ajweb.model;


import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import ajweb.utils.FileUtils;
import ajweb.utils.Template;
/**
 * �f�[�^�x�[�X�e�[�u��������킷�N���X
 * @author hiroki
 *
 */
public class DBData implements Expression{
	public String name;
	public String dbDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	public String dbName = "jdbc:derby:" + System.getProperty("ajweb.work") + "derby";
	public String type = "server";
	public DBData(String name, String dbDriver,String dbName){
		this.name = name;
		this.dbDriver = dbDriver;
		this.dbName = dbName;
	}
	public HashMap<String, String> properties = new HashMap<String, String>();
	/**
	 * AJML��dbdata�v�f����f�[�^�x�[�X�p��java�R�[�h�𐶐�
	 */
	public void generate(String workDirectory, String appName) {
		String fs = FileUtils.fs;
		//�f�[�^�x�[�X�̃X�L�[�}���擾
		Iterator<Entry<String, String>> ite = properties.entrySet().iterator();
		String properties_set = "";
		while(ite.hasNext()){
			
			Entry<String, String> property = ite.next();
			properties_set += "\t\tproperties.put(\"" + property.getKey() + "\", \"" + property.getValue() + "\");\n";
			
		}
				
		try {
			Template dbTableTemplate = new Template("dbtable");
			dbTableTemplate.apply("TABLENAME", name);
//			dbName = Application.appName;
			dbTableTemplate.apply("DBNAME", dbName);
			dbTableTemplate.apply("DRIVERCLASSNAME", dbDriver);
			
			dbTableTemplate.apply("PROPERTIES", properties_set);

			//file�ɏ����o��
			FileUtils.writeFile(workDirectory + fs + appName + fs + "WEB-INF" + fs +"src" + fs + "ajweb" + fs + "db" + fs + name + ".java", dbTableTemplate.source);
			System.out.println("generate " + workDirectory + fs +  appName + fs + 
					"WEB-INF" + fs + "src" + fs + "ajweb" + fs + "db" + 
					fs  + name + ".java");			
		} catch (IOException e) {
			// 
			e.printStackTrace();
		}
		
		/*client �̃e�[�u�����`���`���Ă���Ȃ�N���C�A���g�e�[�u��javaScript�𐶐�*/
				
	}
	
	public String toString() {
		return name + properties;
	}
}
