package ajweb.servlet;

import java.io.IOException;

import java.io.PrintWriter;

import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


import org.eclipse.jetty.util.ajax.JSON;


import ajweb.data.*;

import ajweb.servlet.AbstractServlet;
import ajweb.utils.Log;


@SuppressWarnings("serial")
public class AjWebApp extends HttpServlet/*extends AbstractServlet*/ {

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {	
		Log.serverLogger.fine("doGet");
		
		System.out.println("doGet");
		resp.setContentType("text/html");
		resp.setCharacterEncoding("UTF-8");
		Log.serverLogger.fine("chat app doGet");
     }

	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		HttpSession session = req.getSession(false);

		resp.setContentType("text/html");
		resp.setCharacterEncoding("UTF-8");

		//System.out.println("request doPost  action: " + req.getParameter("action") + ", table: " + req.getParameter("table") + ", param: " + req.getParameter("param"));
		Log.serverLogger.fine("chat app doPost:  {" + "action: " + req.getParameter("action") + ", table: " + req.getParameter("table") + ", param: " + req.getParameter("param") + "}");
		Log.servletLogger.fine("doPost   action: " + req.getParameter("action") + ", table: " + req.getParameter("table") + ", param: " + req.getParameter("param"));
		String action = req.getParameter("action");//join(login) , poll , insert, delete, update repoll
		String tablename = req.getParameter("table");
		String param_json = req.getParameter("param");

		HashMap param = (HashMap) JSON.parse(param_json);
		ArrayList<HashMap<String, String>> result;		
		PrintWriter out = resp.getWriter();
		
		if(action.equals("join")){
			session = req.getSession(true);//create new session
			if(session.isNew()){
			}
			return;
		}
		else if(session == null){
			resp.sendError(403);
		}
		else {
			Log.servletLogger.fine("sessionid: " + session.getId() + " , action: " + action + ", param:" + param_json);
			if (action.equals("poll")){
				HashMap<String, ArrayList<AbstractCondition>> relatedDatum = Condition.parse(param_json);
	//			poll(req, resp, session.getId(), relatedDatum);
			}
			else if(action.equals("repoll")){
//				repoll();
			}
			else if(action.equals("select")){

				Condition condition = null;
				result = new ArrayList<HashMap<String, String>>();
				if(param != null)
					condition = new Condition((String)param.get("op"),(String)param.get("property"), (String)param.get("value"));
				try {
					if(tablename.equals("message"))
						result = message.select(condition);
					else if(tablename.equals("room"))
						result = room.select(condition);
					else 
						result = new ArrayList<HashMap<String, String>>();
					out.print("{ items : " + JSON.toString(result) + "}");
				} catch (Exception e) {
					out.print("{ items : " + JSON.toString(result) + "}");
					e.printStackTrace();
				}
			}
			else if (action.equals("insert")) {
				try {
					if(tablename.equals("message"))
//						change(req, resp,  session.getId(), tablename, "insert", message.insert(param));
					//else if(tablename.equals("room"))
//						change(req, resp,  session.getId(), tablename, "insert", room.insert(param));
					//else ;


					;
					
					out.print("{ result : true }");
				} catch (Exception e){
					out.print("{ result : false }");
					e.printStackTrace();
				}
			}
			else if(action.equals("update")){
				try {
					if(tablename.equals("message"))
//						change(req, resp,  session.getId(), tablename, "update", message.update(param));
					//else if(tablename.equals("room"))
//						change(req, resp,  session.getId(), tablename, "update", room.update(param));
					//else ;


					;
					
					out.print("{ result : true");
				} catch (Exception e){
					out.print("{ result : false");
					e.printStackTrace();
				}
			}
			else if(action.equals("delete")){
				try {
					if(tablename.equals("message"))
//						change(req, resp,  session.getId(), tablename, "delete", message.delete(param));
//					else if(tablename.equals("room"))
//						change(req, resp,  session.getId(), tablename, "delete", room.delete(param));
//					else ;


					;
					
					out.print("{ result : true");
				} catch (Exception e){
					out.print("{ result : false");
					e.printStackTrace();
				}
			}
		}
	}

	
	protected HashMap<String, String> getDatabaseProperties(String tablename) {
		if(tablename.equals("message")){
			return message.properties;	
		}
		else

			return null;
	}
}