package ajweb.servlet;

import java.io.IOException;

import java.io.PrintWriter;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.HashMap;


import java.util.LinkedList;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
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
		Continuation _continuation;//jettyの場合
		
		LinkedList<Modification> _queue = new LinkedList<Modification>(); //変更の情報
		HashMap<String, ArrayList<AbstractCondition>> relatedDBDatum = new HashMap<String, ArrayList<AbstractCondition>>();		//テーブルごとのどの変更が自分に関係あるかの情報
	}

	Map<String, Member> members = new HashMap<String, Member>();//

	abstract protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;
	abstract protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;
	abstract protected HashMap<String, String> getDatabaseProperties(String tablename);

	protected synchronized void join(HttpServletRequest req, HttpServletResponse resp,
			 String sessionid) throws InterruptedException, IOException {
		Member member = new Member();
		member._sessionid = sessionid;
		
		members.put(sessionid, member);//TO DO ログアウト  定期的に,continuationがないやつを消すとか？
		Log.servletLogger.fine("session_id: " + sessionid + " joined ");
		
		PrintWriter out = resp.getWriter();
		if(isSupportJettyContinuation)//jetty のcontinuationが使える場合
			out.print("1");
		else 
			out.print("3000");
	}
	
	protected
	synchronized void poll(HttpServletRequest req, HttpServletResponse resp, 
			String sessionid, HashMap<String, ArrayList<AbstractCondition>> relatedDBDatum) throws IOException {
		Log.servletLogger.fine("poll  sessionid:" + sessionid + " related:"  + relatedDBDatum);

		Member member = members.get(sessionid);
		if(member == null){

			Log.servletLogger.fine("sessionid : " +  sessionid + " have not join");
					
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
				if(isSupportJettyContinuation){//jetty のcontinuationが使える場合
					Continuation continuation = ContinuationSupport.getContinuation(req);//, resp);
					continuation.setTimeout(Config.TIMEOUT);
					if (continuation.isInitial()){
						// 一時停止してタイムアウトかmodificationをまつ
						Log.servletLogger.fine( "sessionid: " + member._sessionid + " suspend continuation");
						continuation.suspend();
						member._continuation=continuation;
					}
					else{
						PrintWriter out = resp.getWriter();
						out.print("[]");
					}
				}
				else {
					PrintWriter out = resp.getWriter();
					out.print("[]");
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
		Log.servletLogger.fine(  "sessionid:"+ sessionid +"  change action:"  + " " + action);
		//サーバーのデータをクライアントに伝搬させる
		Log.servletLogger.fine("send modification to clients  clients.size:" + members.size());
		if(members.size() > 0){
			for (Member m:members.values()){
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
					if(isSupportJettyContinuation){//jetty のcontinuationが使える場合
						if (m._continuation!=null){
							Log.servletLogger.fine("クライアントに変更を伝搬　　　　　session_id: " + m._sessionid + "   resume continuation "); 
							m._continuation.resume();
							m._continuation = null;
						}
					}
				}
			}
		}
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
						if(isSupportJettyContinuation){//jetty のcontinuationが使える場合
							if (m._continuation != null && m._queue.size() > 0){
								Log.servletLogger.fine("クライアントに変更を伝搬　　　　　session_id: " + m._sessionid + "resume continuation "); 
								m._continuation.resume();
								m._continuation = null;
							}
						}
					}
				}		
			}
		}
	}
	
	protected synchronized void repoll(){
		if(isSupportJettyContinuation){//jetty のcontinuationが使える場合
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

	
//continuation をサポートしているかを判定。jettyの本体のソースを拝借
	 static final boolean __jetty6;
	 static final boolean __servlet3;
	 static final Class<?> __waitingContinuation;
	 static final Constructor<? extends Continuation> __newServlet3Continuation;
	 static final Constructor<? extends Continuation> __newJetty6Continuation;
	 static
	 {
		 boolean servlet3Support=false;
		 Constructor<? extends Continuation>s3cc=null;
		 try
		 {
			 boolean servlet3=ServletRequest.class.getMethod("startAsync")!=null;
			 if (servlet3)
			 {
				 Class<? extends Continuation> s3c = ContinuationSupport.class.getClassLoader().loadClass("org.eclipse.jetty.continuation.Servlet3Continuation").asSubclass(Continuation.class);
				 s3cc=s3c.getConstructor(ServletRequest.class);
				 servlet3Support=true;
			 }
		 }
		 catch (Exception e)
		 {}
		 finally
		 {
			 __servlet3=servlet3Support;
			 __newServlet3Continuation=s3cc;
		 }
		 
		 boolean jetty6Support=false;
		 Constructor<? extends Continuation>j6cc=null;
		 try
		 {
			 Class<?> jetty6ContinuationClass = ContinuationSupport.class.getClassLoader().loadClass("org.mortbay.util.ajax.Continuation");
			 boolean jetty6=jetty6ContinuationClass!=null;
			 if (jetty6)
			 {
				 Class<? extends Continuation> j6c = ContinuationSupport.class.getClassLoader().loadClass("org.eclipse.jetty.continuation.Jetty6Continuation").asSubclass(Continuation.class);
				 j6cc=j6c.getConstructor(ServletRequest.class, jetty6ContinuationClass);
				 jetty6Support=true;
			 }
		 }
		 catch (Exception e)
		 {}
		 finally
		 {
			 __jetty6=jetty6Support;
			 __newJetty6Continuation=j6cc;
		 }
		 
		 Class<?> waiting=null;
		 try
		 {
			 waiting=ContinuationSupport.class.getClassLoader().loadClass("org.mortbay.util.ajax.WaitingContinuation");
		 }
		 catch (Exception e)
		 {
		 }
		 finally
		 {
			 __waitingContinuation=waiting;
		 }
	 }
	 static boolean isSupportJettyContinuation = __servlet3 || __jetty6; 	
}