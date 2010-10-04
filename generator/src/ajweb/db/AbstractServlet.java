package ajweb.db;


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

import ajweb.db.Condition;
import ajweb.db.Modification;



@SuppressWarnings("serial")
public abstract class AbstractServlet extends HttpServlet {

	class Member
	{ 
		String _sessionid;
		Continuation _continuation;
		LinkedList<ArrayList<Modification>> _queue = new LinkedList<ArrayList<Modification>>(); //�ύX�̏��
		HashMap<String, Condition> relatedDBDatum = new HashMap<String, Condition>();		//�e�[�u�����Ƃ̂ǂ̕ύX�������Ɋ֌W���邩�̏��

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

		System.out.println( "session_id:" + sessionid + " joined ");
	}
	
	@SuppressWarnings("deprecation")
	protected
	synchronized void poll(HttpServletRequest req, HttpServletResponse resp, 
			String sessionid, String tablename, Condition condition) throws IOException {
		System.out.println("poll  sessionid:" + sessionid);

		Member member = members.get(sessionid);
		if(member == null){
			System.out.println("sessionid :" +  sessionid + " have not join");
			resp.sendError(503);
			return;
		}
		member.relatedDBDatum.put(tablename, condition);
		synchronized (member) {
			if (member._queue.size()>0){
				/*�ύX���N������N���C�A���g�ɔ��f*/
				ArrayList<Modification> modifications = member._queue.poll();
				
				PrintWriter out = resp.getWriter();
				out.print(Modification.toJSON(modifications));
				}
			else {
				Continuation continuation = ContinuationSupport.getContinuation(req, resp);
				if (continuation.isInitial()){
					// queue�̒��Ƀ`���b�g���Ȃ���΁A�ꎞ��~���ă^�C���A�E�g���`���b�g���܂�
					System.out.println("suspend continuation:" + member._sessionid);
					
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

	protected synchronized void change(HttpServletRequest req, HttpServletResponse resp,
			String sessionid, String tablename, String action, HashMap<String, String> item) throws Exception {
		System.out.println(action + "  sessionid:" + sessionid);
		
		//�T�[�o�[�̃f�[�^���N���C�A���g�ɓ`��������
		if(members.size() > 0){
			for (Member m:members.values()){//���݃R�l�N�V�����𒣂��Ă��邷�ׂẴN���C�A���g�̃L���[�ɓ����
				synchronized (m) {
					//�N���C�A���g�Ɋ֌W���邩����
					if(m.relatedDBDatum.containsKey(tablename) && m.relatedDBDatum.get(tablename).related(item)){
						System.out.println("add " + sessionid + ": " + item);
						Modification modification = new Modification(tablename, action , item);
						ArrayList<Modification> modifications = new ArrayList<Modification>();
						modifications.add(modification);
					//modication���L���[�ɓ����
						m._queue.add(modifications); //chat
					
						if (m._continuation!=null){
							System.out.println("resume continuation: " + m._sessionid);
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
}
