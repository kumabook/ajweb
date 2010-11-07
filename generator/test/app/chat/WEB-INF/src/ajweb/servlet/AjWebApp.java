package ajweb.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


import org.eclipse.jetty.util.ajax.JSON;

import ajweb.db.Condition;

import ajweb.servlet.AbstractServlet;
import ajweb.db.*;


@SuppressWarnings("serial")
public class AjWebApp extends AbstractServlet {

	

	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {	
		System.out.println("doGet");
		
		resp.setContentType("text/html");
		resp.setCharacterEncoding("UTF-8");
		//PrintWriter out = resp.getWriter();
		//ArrayList<HashMap<String, String>> result;

     }

	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		HttpSession session = req.getSession(false);

		resp.setContentType("text/html");
		resp.setCharacterEncoding("UTF-8");
//		System.out.println(req.getParameterMap());
		System.out.println("action :" + req.getParameter("action"));
		System.out.println("table :" + req.getParameter("table"));
		System.out.println("param : " + req.getParameter("param"));
		String action = req.getParameter("action");//join(login) , poll , insert, (delete, update) //repoll
		String tablename = req.getParameter("table");
		String param_json = req.getParameter("param");

		HashMap param = (HashMap) JSON.parse(param_json);
		ArrayList<HashMap<String, String>> result;		
		PrintWriter out = resp.getWriter();

		
		if(action.equals("join")){
			session = req.getSession(true);//セッションを新規作成
			System.out.println("test pree" + action);
			if(session.isNew()){
					System.out.println("test before");
				try {
					join(req, resp, session.getId());
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
		System.out.println("test after");
			}
			return;
		}
		else if(session == null){
			resp.sendError(403);
		}
			
		else {
			System.out.println("sessionid: " + session.getId() + " , action: " + action + ", param:" + param_json);
			if (action.equals("poll")){
//			Condition condition = new Condition((String)param.get("op"),(String)param.get("property"), (String)param.get("value"));
				HashMap<String, ArrayList<AbstractCondition>> relatedDatum = Condition.parse(param_json);
				//HashMap<String, Condition> relatedDatum = new HashMap<String, Condition>();

				/*Iterator<String> ite = param.keySet().iterator();
				while(ite.hasNext()){
					String key = ite.next();
					HashMap<String, ArrayList<String>> con = (HashMap<String, ArrayList<String>>)param.get(key);
					
					//Condition condition = new Condition((String) con.get("op"), (String) con.get("property"),(String) con.get("value"));
					relatedDatum.put(key, condition);
				}*/
			poll(req, resp, session.getId(), relatedDatum);
			}
			else if(action.equals("repoll")){
				resume();
			}
			else if(action.equals("select")){
				try {
					Condition condition;
					if(param != null)
						condition = new Condition((String)param.get("op"),(String)param.get("property"), (String)param.get("value"));
					else 
						condition = null;
					if(tablename.equals("chat"))
						result = chat.select(condition);
					else if(tablename.equals("room")){
						
						result = room.select(null);
					}
					else		
					//if(tablename.equals("chat"))
					//result = chat.select(condition);
						result = new ArrayList<HashMap<String, String>>();
				
					out.print("{ items : " + JSON.toString(result) + "}");
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
				
			else if (action.equals("insert")) {//
				try {
					System.out.println("insert " + tablename + " " + param);
					if(tablename.equals("chat")){
						change(req, resp,  session.getId(), tablename, "insert", chat.insert(param));
					}
					else if(tablename.equals("room")){
						change(req, resp,  session.getId(), tablename, "insert", room.insert(param));
					} 
				} catch (Exception e){
					e.printStackTrace();
				}
			}
		}
	}
}
