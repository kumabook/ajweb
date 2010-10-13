package ajweb.servlet;

import java.sql.SQLException;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import ajweb.db.chat;
import ajweb.db.room;

public class AjWebListener implements ServletContextListener{
	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		System.out.println("context initialized");
		try {
			chat.create();
			System.out.println("chat create");
		} catch (Exception e) {
			System.out.println("chat is already exists");
		}	
		
		
		
		try {
			room.create();
			System.out.println("chat create");
		} catch (Exception e) {
			System.out.println("room is already exists");
			
		}	
			
			
		
		
	}
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		System.out.println("context destroyed");
		try {
			chat.drop();
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
