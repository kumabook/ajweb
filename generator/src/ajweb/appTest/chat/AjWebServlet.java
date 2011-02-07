package ajweb.appTest.chat;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.eclipse.jetty.util.ajax.JSON;

import ajweb.data.AbstractCondition;
import ajweb.data.Condition;
import ajweb.servlet.AbstractServlet;
import ajweb.utils.Log;

public class AjWebServlet extends AbstractServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {	
		Log.serverLogger.fine("doGet");
		
		resp.setContentType("text/html");
		resp.setCharacterEncoding("UTF-8");
		Log.serverLogger.fine("chat app doGet");
     }

	@SuppressWarnings({ "unchecked" })
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
			if(!session.isNew()){
				session.invalidate();
				session = req.getSession(true);
			}
			if(session.isNew()){
				try {
					join(req, resp, session.getId());
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
			return;
		}
		else if(action.equals("quit")){
			try {
				quit(req, resp, session.getId());
				session = req.getSession(true);
				session.invalidate();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		else if(session == null){
			resp.sendError(403);
		}
		else {
			Log.servletLogger.fine("sessionid: " + session.getId() + " , action: " + action + ", param:" + param_json);
			if (action.equals("poll")){
				HashMap<String, ArrayList<AbstractCondition>> relatedDatum = Condition.parse(param_json);
				poll(req, resp, session.getId(), relatedDatum);
			}
			else if(action.equals("repoll")){
				repoll(req);
			}
			else if(action.equals("select")){

				Condition condition = null;
				result = new ArrayList<HashMap<String, String>>();
				if(param != null)
					condition = new Condition((String)param.get("op"),(String)param.get("property"), (String)param.get("value"));
				try {
					if(tablename.equals("room"))
						result = room.select(condition);
					else if(tablename.equals("message"))
						result = message.select(condition);
					else if(tablename.equals("users"))
						result = users.select(condition);
					else
					result = new ArrayList<HashMap<String, String>>();
					out.print("{ items : " + JSON.toString(result) + "}");
				} catch (Exception e) {
					out.print("{ items : " + JSON.toString(result) + "}");
					e.printStackTrace();
				}
			}
			else if (action.equals("insert")) {
				HashMap<String, String> item = null;
				try {
					if(tablename.equals("room")){
						item = room.insert(param);
						change(req, resp,  session.getId(), tablename, "insert", item);
					}
					else if(tablename.equals("message")){
						item = message.insert(param);
						change(req, resp,  session.getId(), tablename, "insert", item);
					}
					else if(tablename.equals("users")){
						item = users.insert(param);
						change(req, resp,  session.getId(), tablename, "insert", item);
					}
					else ;
					;
					
					if(item != null)
						out.print("{ result : true }");
					else
						out.print("{ result : false }");
				} catch (Exception e){
					out.print("{ result : false}");
					e.printStackTrace();
				}
			}
			else if(action.equals("update")){
				HashMap<String, String> item = null;
				try {
					if(tablename.equals("room")){
						item = room.update(param);
						change(req, resp,  session.getId(), tablename, "update", item);
					}
					else if(tablename.equals("message")){
						item = message.update(param);
						change(req, resp,  session.getId(), tablename, "update", item);
					}
					else if(tablename.equals("users")){
						item = users.update(param);
						change(req, resp,  session.getId(), tablename, "update", item);
					}
					else ;
					;
					
					if(item != null)
						out.print("{ result : true }");
					else
						out.print("{ result : false }");
				} catch (Exception e){
					out.print("{ result : false}");
					e.printStackTrace();
				}
			}
			else if(action.equals("delete")){
				HashMap<String, String> item = null;
				try {
					if(tablename.equals("room")){
						item = room.delete(param);
						change(req, resp,  session.getId(), tablename, "delete", item);
					}
					else if(tablename.equals("message")){
						item = message.delete(param);
						change(req, resp,  session.getId(), tablename, "delete", item);
					}
					else if(tablename.equals("users")){
						item = users.delete(param);
						change(req, resp,  session.getId(), tablename, "delete", item);
					}
					else ;
					;
					
					if(item != null)
						out.print("{ result : true }");
					else
						out.print("{ result : false }");
				} catch (Exception e){
					out.print("{ result : false }");
					e.printStackTrace();
				}
			}
			else if(action.equals("check")){
				AbstractCondition con = (AbstractCondition) Condition.parseCondition(param_json);
				boolean _result = false;
				try {
					if(tablename.equals("room"))
						_result = room.check(con);
					else if(tablename.equals("message"))
						_result = message.check(con);
					else if(tablename.equals("users"))
						_result = users.check(con);
					else ;			
					;
				} catch(Exception e){
					_result = false;
				}
				out.print("{ result: " + _result + "}");
			}
						else if(action.equals("login")){
				boolean _result = false;
				try {
					_result = users.login((String) param.get("user_id"), (String) param.get("password"));
				} catch (Exception e) {
					_result = false;
				}
				out.print("{ result: " + _result + "}");
			}
		}
	}

	protected HashMap<String, String> getDatabaseProperties(String tablename) {
		if(tablename.equals("room")){
			return room.properties;	
		}
		else if(tablename.equals("message")){
			return message.properties;	
		}
		else if(tablename.equals("users")){
			return users.properties;	
		}
		else ;
			return null;
	}
}
