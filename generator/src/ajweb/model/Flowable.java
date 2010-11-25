package ajweb.model;

import java.io.IOException;

public interface Flowable {
	/**
	 * javaScript�\�[�X�ɕϊ�
	 * @param func �R�[���o�b�N�֐��̈������󂯎��֐���
	 * @param key func�Ŏ󂯎�������
	 * @param rest ���̂��ƂɎ��s����鏈��
	 * @return
	 * @throws IOException
	 */
	abstract public String toJsSource(Flowable func, String key, Action rest) throws IOException;
	/**
	 * �R�[���o�b�N�֐���K�v�Ƃ��������������Ԃ�
	 * @return
	 */
	abstract public boolean containCallback();
}
