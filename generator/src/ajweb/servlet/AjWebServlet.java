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
				/*�ύX���N������N���C�A���g�ɔ��f*///��x�ɕ�����modifications��`�����Ă��悢�������͌��̈�̂̂�
				ArrayList<Modification> modifications = member._queue.poll();
				
				PrintWriter out = resp.getWriter();
				out.print(Modification.toJSON(modifications));
				}
			else {
				Continuation continuation = ContinuationSupport.getContinuation(req, resp);
				if (continuation.isInitial()){
					// queue�̒��Ƀ`���b�g���Ȃ���΁A�ꎞ��~���ă^�C���A�E�g���`���b�g���܂�
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
	 * @param item //�ύX�̓��e
	 * @throws Exception
	 */
	protected synchronized void change(HttpServletRequest req, HttpServletResponse resp,
			String sessionid, String tablename, String action, HashMap<String, String> item) throws Exception {
		System.out.println( "sessionid: ���ύX����������" + sessionid + " " + action);
		
		
		System.out.println(members.size());
		//�T�[�o�[�̃f�[�^���N���C�A���g�ɓ`��������
		if(members.size() > 0){
			for (Member m:members.values()){//���݃R�l�N�V�����𒣂��Ă��邷�ׂẴN���C�A���g�̃L���[�ɓ����
				synchronized (m) {
					System.out.println("���݂̃R�l�N�V������\���Ă���N���C�A���g�Ɗ֌W���邩����" + sessionid );
					//�N���C�A���g�Ɋ֌W���邩����
					if(m.relatedDBDatum.containsKey(tablename) && m.relatedDBDatum.get(tablename).related(item)){
						
//						System.out.println("add " + sessionid + ": " + item);
						Modification modification = new Modification(tablename, action , item);
						ArrayList<Modification> modifications = new ArrayList<Modification>();
						modifications.add(modification);
					//modication���L���[�ɓ����
						m._queue.add(modifications); //chat
					
						if (m._continuation!=null){
							System.out.println("�N���C�A���g�ɕύX��`���@�@�@�@�@session_id: " + m._sessionid + "resume continuation "); 
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
		System.out.println( "sessionid: ���ύX����������" + sessionid + " " + modifications);

		System.out.println(members.size());
		//�T�[�o�[�̃f�[�^���N���C�A���g�ɓ`��������
		if(members.size() > 0){
			for (Member m:members.values()){//���݃R�l�N�V�����𒣂��Ă��邷�ׂẴN���C�A���g�̃L���[�ɓ����
				synchronized (m) {
					ArrayList<Modification> m_modifications = new ArrayList<Modification>();//�N���C�A���g���ƂɕύX�̃��X�g���č\��
					System.out.println("���݂̃R�l�N�V������\���Ă���N���C�A���g�Ɗ֌W���邩����" + sessionid );
					//�N���C�A���g�Ɋ֌W���邩����
					for(int i = 0; i < modifications.size(); i++){
						String tablename = modifications.get(i).tablename;
						if(m.relatedDBDatum.containsKey(tablename) && m.relatedDBDatum.get(tablename).related(modifications.get(i).item)){
							m_modifications.add(modifications.get(i));
						}
					}
					//											
					//modication���L���[�ɓ����
					m._queue.add(m_modifications); //chat
					if (m._continuation != null && m_modifications.size() > 0){
						System.out.println("�N���C�A���g�ɕύX��`���@�@�@�@�@session_id: " + m._sessionid + "resume continuation "); 
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
			for (Member m:members.values()){//���݃R�l�N�V�����𒣂��Ă��邷�ׂẴN���C�A���g�̃L���[�ɓ����
				synchronized (m) {
					if (m._continuation != null ){
						System.out.println("change the polling info : �|�[�����O��񂪍X�V�A�R�l�N�V������\��Ȃ����@�@�@�@�@session_id: " + m._sessionid + "resume continuation "); 
						m._continuation.resume();
						m._continuation = null;
					}
				}
			}
		}
	}
	
}

