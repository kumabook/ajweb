package ajweb.model;

import java.io.IOException;

public interface Flowable {
	/**
	 * javaScriptソースに変換
	 * @param func コールバック関数の引数を受け取る関数名
	 * @param key funcで受け取る引数名
	 * @param rest このあとに実行される処理
	 * @return
	 * @throws IOException
	 */
	abstract public String toJsSource(Flowable func, String key, Action rest) throws IOException;
	/**
	 * コールバック関数を必要とする引数をもつかを返す
	 * @return
	 */
	abstract public boolean containCallback();
}
