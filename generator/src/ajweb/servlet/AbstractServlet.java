package ajweb.servlet;

import java.io.IOException;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;


import java.util.LinkedList;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.continuation.Continuation;
import org.eclipse.jetty.continuation.ContinuationSupport;

import ajweb.Config;
import ajweb.data.AbstractCondition;
import ajweb.data.Modification;
import ajweb.utils.Log;




@SuppressWarnings("serial")
public abstract class AbstractServlet extends HttpServlet{

	class Member
	{ 
		String _sessionid;
		Continuation _continuation;
		LinkedList<Modification> _queue = new LinkedList<Modification>(); //変更の情報
		HashMap<String, ArrayList<AbstractCondition>> relatedDBDatum = new HashMap<String, ArrayList<AbstractCondition>>();		//テーブルごとのどの変更が自分に関係あるかの情報
	}
	
	Map<String, Map<String, Member>> _tables = new HashMap<String, Map<String, Member>>();
	Map<String, Member> members = new HashMap<String, Member>();
	

	abstract protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;
	abstract protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;
	abstract protected HashMap<String, String> getDatabaseProperties(String tablename);

	protected synchronized void join(HttpServletRequest req, HttpServletResponse resp,
			 String sessionid) throws InterruptedException {
		Member member = new Member();
		member._sessionid = sessionid;
		
		members.put(sessionid, member);
		Log.servletLogger.fine("session_id: " + sessionid + " joined ");
		
	}
	
	@SuppressWarnings("deprecation")
	protected
	synchronized void poll(HttpServletRequest req, HttpServletResponse resp, 
			String sessionid, HashMap<String, ArrayList<AbstractCondition>> relatedDBDatum) throws IOException {
		
		//relatedDBDatum = new HashMap<String, Condition>();
		Log.servletLogger.fine("poll  sessionid:" + sessionid + " related:"  + relatedDBDatum);
		//System.out.println("poll  sessionid:" + sessionid + " related:"  + relatedDBDatum);

		Member member = members.get(sessionid);
		if(member == null){
			Log.servletLogger.fine("sessionid : " +  sessionid + " have not join");
			//System.out.println("sessionid : " +  sessionid + " have not join");
					
			resp.sendError(503);
			return;
		}
		member.relatedDBDatum = relatedDBDatum;
		synchronized (member) {
			if (member._queue.size()>0){
				/*変更を起きたらクライアントに反映*///一度に複数のmodificationsを伝搬してもよいかも今は後ろの一個ののみ
				ArrayList<Modification> modifications = new ArrayList<Modification>();
				while(member._queue.size() > 0)	// queueの中にmodificationがなければ
					modifications.add(member._queue.poll());
				
				PrintWriter out = resp.getWriter();
				out.print(Modification.toJSON(modifications));
				}
			else {
				Continuation continuation = ContinuationSupport.getContinuation(req, resp);
				continuation.setTimeout(Config.TIMEOUT);
				if (continuation.isInitial()){
					// 一時停止してタイムアウトかmodificationをまつ
					Log.servletLogger.fine( "sessionid: " + member._sessionid + " suspend continuation");
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
	 * テーブル名、変更の種類、変更する要素を指定して、変更をクライアントのキューに入れる
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
		Log.servletLogger.fine(  "sessionid:"+ sessionid +"  が変更を加えたよ"  + " " + action);
		
		//サーバーのデータをクライアントに伝搬させる
		Log.servletLogger.fine("send modification to clients  clients.size:" + members.size());
		if(members.size() > 0){
			for (Member m:members.values()){//現在コネクションを張っているすべてのクライアントのキューに入れる
				synchronized (m) {
					Log.servletLogger.fine("現在のコネクションを貼っているクライアントと関係あるか判定 sessionid: " + sessionid );
					//クライアントに関係あるか判定
					Modification modification = new Modification(tablename, action , item);
					ArrayList<AbstractCondition> conditions = m.relatedDBDatum.get(tablename);
					if(conditions != null){
						for(int j = 0; j < conditions.size(); j++){
							if(conditions.get(j).related(modification.item, getDatabaseProperties(tablename)))//ひとつでも関係あれば
								m._queue.add(modification); //modicationをキューに入れる
						}
					}
					if (m._continuation!=null){
						Log.servletLogger.fine("クライアントに変更を伝搬　　　　　session_id: " + m._sessionid + "   resume continuation "); 
						m._continuation.resume();
						m._continuation = null;
					}
				}
			}
		}
//PrintWriter out = resp.getWriter();
	//	out.print("{action:\""+ action +"\", ");  
	}
	/**
	 * 複数のmodificationを受け取り、クライアントのキューに入れる (オフライン→オンライン時のクライアントの変更履歴の反映用)
	 * @param req
	 * @param resp
	 * @param sessionid
	 * @param modifications
	 * @throws Exception
	 */
	protected synchronized void change(HttpServletRequest req, HttpServletResponse resp,
			String sessionid, ArrayList<Modification> modifications) throws Exception {
		Log.servletLogger.fine( "sessionid: が変更を加えたよ sessionid:" + sessionid + " " + modifications);

		//サーバーのデータをクライアントに伝搬させる
		Log.servletLogger.fine("send modification to clients  clients.size:" + members.size());
		if(members.size() > 0){
			for (Member m:members.values()){//現在コネクションを張っているすべてのクライアントのキューに入れる
				synchronized (m) {
					//ArrayList<Modification> m_modifications = new ArrayList<Modification>();//クライアントごとに変更のリストを再構成
					Log.servletLogger.fine( "現在のコネクションを貼っているクライアントと関係あるか判定 sessionid: " + sessionid );
					//クライアントに関係あるか判定
					for(int i = 0; i < modifications.size(); i++){
						String tablename = modifications.get(i).tablename;
						ArrayList<AbstractCondition> conditions = m.relatedDBDatum.get(tablename);
						//if(m.relatedDBDatum.containsKey(tablename) && m.relatedDBDatum.get(tablename).related(modifications.get(i).item)){
						if(conditions != null){
							for(int j = 0; j < conditions.size(); j++){
								if(conditions.get(j).related(modifications.get(i).item, getDatabaseProperties(tablename)))//ひとつでも関係あれば
									m._queue.add(modifications.get(i));//追加!
									//m_modifications.add(modifications.get(i));//追加!
							}
						}	
					//modicationをキューに入れる
						//m._queue.addAll((m_modifications)); 
						if (m._continuation != null && m._queue.size() > 0){
							Log.servletLogger.fine("クライアントに変更を伝搬　　　　　session_id: " + m._sessionid + "resume continuation "); 
							m._continuation.resume();
							m._continuation = null;
						}
					}
				}
			}	
		}
//		PrintWriter out = resp.getWriter();
		//out.print("{action: \""+ "change \"}");
	}
	
	protected synchronized void repoll(){
		if(members.size() > 0){
			for (Member m:members.values()){
				synchronized (m) {
					if (m._continuation != null){
						Log.servletLogger.fine("change the polling info : ポーリング情報が更新、コネクションを貼りなおす      session_id: " + m._sessionid + "resume continuation "); 
						m._continuation.resume();
						m._continuation = null;
					}
				}
			}
		}
	}
}