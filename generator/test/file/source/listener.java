package ajweb.servlet;

import java.sql.SQLException;
import java.util.HashMap;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.eclipse.jetty.util.ajax.JSON;
import ajweb.data.*;

public class AjWebListener implements ServletContextListener{

    @SuppressWarnings("unchecked")
    @Override
	public void contextInitialized(ServletContextEvent arg0) {
	System.out.println("context initialized");

	try {
		room.create();
		System.out.println("room create");
		room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���P\"}"));
		room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���Q\"}"));
		room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���R\"}"));
		room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���S\"}"));
		room.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���T\"}"));

	} catch (Exception e) {
		System.out.println("room is already exists");
	}

	try {
		message.create();
		System.out.println("message create");
		message.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���P\"}"));
		message.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���Q\"}"));
		message.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���R\"}"));
		message.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���S\"}"));
		message.insert((HashMap<String, String>) JSON.parse("{\"name\": \"���[���T\"}"));

	} catch (Exception e) {
		System.out.println("message is already exists");
	}

    }
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		System.out.println("context destroyed");
		try {
			message.drop();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}