package ajweb.jsunit;

import java.util.HashMap;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.eclipse.jetty.util.ajax.JSON;
import ajweb.data.Sql;


public class TestListener implements ServletContextListener{
	@SuppressWarnings("unchecked")
	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		try { message.drop(); } catch (Exception e) {}	
		try { room.drop(); } catch (Exception e) {}	
		try { users.drop(); } catch (Exception e) {}	
		
		
		
		System.out.println("context initialized");
		try {
			message.create();
			System.out.println("message create");
		} catch (Exception e) {
			System.out.println("message table is already exists");
		}	
		try {
			room.create();
			System.out.println("room create");
			
			room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"room1\"}"));
			room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"room2\"}"));
			room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"room3\"}"));
			room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"room4\"}"));
			room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"room5\"}"));
			
		} catch (Exception e) {
			System.out.println("room table is already exists");
			
		}
		try {
			users.create();
			System.out.println("users create chat");
			
			users.insert((HashMap<String, String>) JSON.parse("{\"user_id\": \"kumabook\", \"password\": \""+Sql.encryption("password")+"\"}"));
			users.insert((HashMap<String, String>) JSON.parse("{\"user_id\": \"kumamoto\", \"password\": \""+Sql.encryption("kumamoto")+"\"}"));
			users.insert((HashMap<String, String>) JSON.parse("{\"user_id\": \"hiroki\", \"password\": \""+Sql.encryption("hiroki")+"\"}"));
			
		} catch (Exception e) {
			System.out.println("room table is already exists");
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
	}
}