package ajweb.model;

import java.io.IOException;
/**
 * ������������킷���f��
 * @author hiroki
 *
 */
public abstract class AbstractCondition implements Parameterable , AbstractModel{
	/**
	 * �N���C�A���g�ƃT�[�o�̃f�[�^�x�[�X�Ԃ̃|�[�����O�p�̏�����json�֕ϊ�
	 * @param database
	 * @param func
	 * @param key
	 * @param rest
	 * @return
	 * @throws IOException
	 */
	abstract public String toJsPollingCondition(String database, Flowable func, String key, Action rest) throws IOException;
}
