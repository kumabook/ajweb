package ajweb.appTest.chat;

import java.util.HashMap;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.eclipse.jetty.util.ajax.JSON;

public class AjWebListener implements ServletContextListener{

    @SuppressWarnings("unchecked")
    @Override
	public void contextInitialized(ServletContextEvent arg0) {
	System.out.println("context initialized");

try {
		users.create();
		System.out.println("users create");
		users.insert((HashMap<String, String>) JSON.parse("{ \"user_id\": \"kumamoto\", \"password\": \"7b956825555b092114ca2585a86c0ffe\", \"role\": \"admin\"}"));
		users.insert((HashMap<String, String>) JSON.parse("{ \"user_id\": \"hiroki\", \"password\": \"13879a74c1119ece849b664b0ad76df1\", \"role\": \"normal\"}"));

	} catch (Exception e) {
		System.out.println("users is already exists");
	}
try {
		message.create();
		System.out.println("message create");

	} catch (Exception e) {
		System.out.println("message is already exists");
	}
try {
		room.create();
		System.out.println("room create");
		room.insert((HashMap<String, String>) JSON.parse("{ \"name\": \"room1\"}"));

	} catch (Exception e) {
		System.out.println("room is already exists");
	}
    }
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		System.out.println("context destroyed");
	}
}
