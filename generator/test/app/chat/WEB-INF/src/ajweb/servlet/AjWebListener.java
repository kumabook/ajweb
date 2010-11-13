package ajweb.servlet;

import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.eclipse.jetty.util.ajax.JSON;

import ajweb.data.message;
import ajweb.data.room;


public class AjWebListener implements ServletContextListener{
	@SuppressWarnings("unchecked")
	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		System.out.println("context initialized");
		try {
			message.create();
			System.out.println("message create");
		} catch (Exception e) {
			System.out.println(e);
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
			System.out.println(e);
			System.out.println("room table is already exists");
			
		}	
			
			
		
		
	}
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		System.out.println("context destroyed");
		try {
			message.drop();
			
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
