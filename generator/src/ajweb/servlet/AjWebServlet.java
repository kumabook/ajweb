package ajweb.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;


import java.util.LinkedList;
import java.util.Map;


import javax.servlet.ServletContextListener;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.continuation.Continuation;
import org.eclipse.jetty.continuation.ContinuationSupport;

import ajweb.db.Condition;
import ajweb.db.Modification;



@SuppressWarnings("serial")
public abstract class AjWebServlet extends HttpServlet{

	class Member
	{ 
		String _sessionid;
		Continuation _continuation;
		LinkedList<ArrayList<Modification>> _queue = new LinkedList<ArrayList<Modification>>(); //変更の情報
		HashMap<String, Condition> relatedDBDatum = new HashMap<String, Condition>();		//テーブルごとのどの変更が自分に関係あるかの情報
	}
	
	Map<String, Map<String, Member>> _tables = new HashMap<String, Map<String, Member>>();
	Map<String, Member> members = new HashMap<String, Member>();
	

	abstract protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;
	abstract protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;
			
	

	protected synchronized void join(HttpServletRequest req, HttpServletResponse resp,
			 String sessionid) {
		Member member = new Member();
		member._sessionid = sessionid;
		
		members.put(sessionid, member);

		System.out.println( "session_id: " + sessionid + " joined ");
	}
	
	@SuppressWarnings("deprecation")
	protected
	synchronized void poll(HttpServletRequest req, HttpServletResponse resp, 
			String sessionid, HashMap<String, Condition> relatedDBDatum) throws IOException {
		System.out.println("poll  sessionid:" + sessionid + " related:"  + relatedDBDatum);

		Member member = members.get(sessionid);
		if(member == null){
			System.out.println("sessionid : " +  sessionid + " have not join");
			resp.sendError(503);
			return;
		}
		member.relatedDBDatum = relatedDBDatum;
		synchronized (member) {
			if (member._queue.size()>0){
				/*変更を起きたらクライアントに反映*///一度に複数のmodificationsを伝搬してもよいかも今は後ろの一個ののみ
				ArrayList<Modification> modifications = member._queue.poll();
				
				PrintWriter out = resp.getWriter();
				out.print(Modification.toJSON(modifications));
				}
			else {
				Continuation continuation = ContinuationSupport.getContinuation(req, resp);
				if (continuation.isInitial()){
					// queueの中にチャットがなければ、一時停止してタイムアウトかチャットをまつ
					System.out.println( "sessionid: " + member._sessionid + " suspend continuation");
					
					continuation.suspend();
					member._continuation=continuation;
				}
				else{
					PrintWriter out = resp.getWriter();
					out.print("{action:\"poll\"}");
				}
			}
		}
	}
	/**
	 * 
	 * @param req
	 * @param resp
	 * @param sessionid
	 * @param tablename
	 * @param action
	 * @param item //変更の内容
	 * @throws Exception
	 */
	protected synchronized void change(HttpServletRequest req, HttpServletResponse resp,
			String sessionid, String tablename, String action, HashMap<String, String> item) throws Exception {
		System.out.println( "sessionid: が変更を加えたよ" + sessionid + " " + action);
		
		
		System.out.println(members.size());
		//サーバーのデータをクライアントに伝搬させる
		if(members.size() > 0){
			for (Member m:members.values()){//現在コネクションを張っているすべてのクライアントのキューに入れる
				synchronized (m) {
					System.out.println("現在のコネクションを貼っているクライアントと関係あるか判定" + sessionid );
					//クライアントに関係あるか判定
					if(m.relatedDBDatum.containsKey(tablename) && m.relatedDBDatum.get(tablename).related(item)){
						
//						System.out.println("add " + sessionid + ": " + item);
						Modification modification = new Modification(tablename, action , item);
						ArrayList<Modification> modifications = new ArrayList<Modification>();
						modifications.add(modification);
					//modicationをキューに入れる
						m._queue.add(modifications); //chat
					
						if (m._continuation!=null){
							System.out.println("クライアントに変更を伝搬　　　　　session_id: " + m._sessionid + "resume continuation "); 
							m._continuation.resume();
							m._continuation = null;
						}
					}
				}
			}
		}
		PrintWriter out = resp.getWriter();
		out.print("{action:\""+ action + "\"}");  
	}
	
	protected synchronized void change(HttpServletRequest req, HttpServletResponse resp,
			String sessionid, ArrayList<Modification> modifications) throws Exception {
		System.out.println( "sessionid: が変更を加えたよ" + sessionid + " " + modifications);

		System.out.println(members.size());
		//サーバーのデータをクライアントに伝搬させる
		if(members.size() > 0){
			for (Member m:members.values()){//現在コネクションを張っているすべてのクライアントのキューに入れる
				synchronized (m) {
					ArrayList<Modification> m_modifications = new ArrayList<Modification>();//クライアントごとに変更のリストを再構成
					System.out.println("現在のコネクションを貼っているクライアントと関係あるか判定" + sessionid );
					//クライアントに関係あるか判定
					for(int i = 0; i < modifications.size(); i++){
						String tablename = modifications.get(i).tablename;
						if(m.relatedDBDatum.containsKey(tablename) && m.relatedDBDatum.get(tablename).related(modifications.get(i).item)){
							m_modifications.add(modifications.get(i));
						}
					}
					//											
					//modicationをキューに入れる
					m._queue.add(m_modifications); //chat
					if (m._continuation != null && m_modifications.size() > 0){
						System.out.println("クライアントに変更を伝搬　　　　　session_id: " + m._sessionid + "resume continuation "); 
						m._continuation.resume();
						m._continuation = null;
					}
				}
			}
		}
		PrintWriter out = resp.getWriter();
		out.print("{action: \""+ "change \"}");
	}
	
	protected synchronized void resume(){
		if(members.size() > 0){
			for (Member m:members.values()){//現在コネクションを張っているすべてのクライアントのキューに入れる
				synchronized (m) {
					if (m._continuation != null ){
						System.out.println("change the polling info : ポーリング情報が更新、コネクションを貼りなおす　　　　　session_id: " + m._sessionid + "resume continuation "); 
						m._continuation.resume();
						m._continuation = null;
					}
				}
			}
		}
	}
	
}

