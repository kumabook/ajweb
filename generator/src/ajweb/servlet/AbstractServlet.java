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
		LinkedList<Modification> _queue = new LinkedList<Modification>(); //�ύX�̏��
		HashMap<String, ArrayList<AbstractCondition>> relatedDBDatum = new HashMap<String, ArrayList<AbstractCondition>>();		//�e�[�u�����Ƃ̂ǂ̕ύX�������Ɋ֌W���邩�̏��
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
				/*�ύX���N������N���C�A���g�ɔ��f*///��x�ɕ�����modifications��`�����Ă��悢�������͌��̈�̂̂�
				ArrayList<Modification> modifications = new ArrayList<Modification>();
				while(member._queue.size() > 0)	// queue�̒���modification���Ȃ����
					modifications.add(member._queue.poll());
				
				PrintWriter out = resp.getWriter();
				out.print(Modification.toJSON(modifications));
				}
			else {
				Continuation continuation = ContinuationSupport.getContinuation(req, resp);
				continuation.setTimeout(Config.TIMEOUT);
				if (continuation.isInitial()){
					// �ꎞ��~���ă^�C���A�E�g��modification���܂�
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
	 * �e�[�u�����A�ύX�̎�ށA�ύX����v�f���w�肵�āA�ύX���N���C�A���g�̃L���[�ɓ����
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
		Log.servletLogger.fine(  "sessionid:"+ sessionid +"  ���ύX����������"  + " " + action);
		
		//�T�[�o�[�̃f�[�^���N���C�A���g�ɓ`��������
		Log.servletLogger.fine("send modification to clients  clients.size:" + members.size());
		if(members.size() > 0){
			for (Member m:members.values()){//���݃R�l�N�V�����𒣂��Ă��邷�ׂẴN���C�A���g�̃L���[�ɓ����
				synchronized (m) {
					Log.servletLogger.fine("���݂̃R�l�N�V������\���Ă���N���C�A���g�Ɗ֌W���邩���� sessionid: " + sessionid );
					//�N���C�A���g�Ɋ֌W���邩����
					Modification modification = new Modification(tablename, action , item);
					ArrayList<AbstractCondition> conditions = m.relatedDBDatum.get(tablename);
					if(conditions != null){
						for(int j = 0; j < conditions.size(); j++){
							if(conditions.get(j).related(modification.item, getDatabaseProperties(tablename)))//�ЂƂł��֌W�����
								m._queue.add(modification); //modication���L���[�ɓ����
						}
					}
					if (m._continuation!=null){
						Log.servletLogger.fine("�N���C�A���g�ɕύX��`���@�@�@�@�@session_id: " + m._sessionid + "   resume continuation "); 
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
	 * ������modification���󂯎��A�N���C�A���g�̃L���[�ɓ���� (�I�t���C�����I�����C�����̃N���C�A���g�̕ύX�����̔��f�p)
	 * @param req
	 * @param resp
	 * @param sessionid
	 * @param modifications
	 * @throws Exception
	 */
	protected synchronized void change(HttpServletRequest req, HttpServletResponse resp,
			String sessionid, ArrayList<Modification> modifications) throws Exception {
		Log.servletLogger.fine( "sessionid: ���ύX���������� sessionid:" + sessionid + " " + modifications);

		//�T�[�o�[�̃f�[�^���N���C�A���g�ɓ`��������
		Log.servletLogger.fine("send modification to clients  clients.size:" + members.size());
		if(members.size() > 0){
			for (Member m:members.values()){//���݃R�l�N�V�����𒣂��Ă��邷�ׂẴN���C�A���g�̃L���[�ɓ����
				synchronized (m) {
					//ArrayList<Modification> m_modifications = new ArrayList<Modification>();//�N���C�A���g���ƂɕύX�̃��X�g���č\��
					Log.servletLogger.fine( "���݂̃R�l�N�V������\���Ă���N���C�A���g�Ɗ֌W���邩���� sessionid: " + sessionid );
					//�N���C�A���g�Ɋ֌W���邩����
					for(int i = 0; i < modifications.size(); i++){
						String tablename = modifications.get(i).tablename;
						ArrayList<AbstractCondition> conditions = m.relatedDBDatum.get(tablename);
						//if(m.relatedDBDatum.containsKey(tablename) && m.relatedDBDatum.get(tablename).related(modifications.get(i).item)){
						if(conditions != null){
							for(int j = 0; j < conditions.size(); j++){
								if(conditions.get(j).related(modifications.get(i).item, getDatabaseProperties(tablename)))//�ЂƂł��֌W�����
									m._queue.add(modifications.get(i));//�ǉ�!
									//m_modifications.add(modifications.get(i));//�ǉ�!
							}
						}	
					//modication���L���[�ɓ����
						//m._queue.addAll((m_modifications)); 
						if (m._continuation != null && m._queue.size() > 0){
							Log.servletLogger.fine("�N���C�A���g�ɕύX��`���@�@�@�@�@session_id: " + m._sessionid + "resume continuation "); 
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
						Log.servletLogger.fine("change the polling info : �|�[�����O��񂪍X�V�A�R�l�N�V������\��Ȃ���      session_id: " + m._sessionid + "resume continuation "); 
						m._continuation.resume();
						m._continuation = null;
					}
				}
			}
		}
	}
}