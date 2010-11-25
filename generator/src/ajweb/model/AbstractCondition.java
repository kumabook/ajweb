package ajweb.model;

import java.io.IOException;
/**
 * 条件式をあらわすモデル
 * @author hiroki
 *
 */
public abstract class AbstractCondition implements Parameterable , AbstractModel{
	/**
	 * クライアントとサーバのデータベース間のポーリング用の条件式jsonへ変換
	 * @param database
	 * @param func
	 * @param key
	 * @param rest
	 * @return
	 * @throws IOException
	 */
	abstract public String toJsPollingCondition(String database, Flowable func, String key, Action rest) throws IOException;
}
