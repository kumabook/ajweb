package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.Application;
import ajweb.model.Expression;

/**
 * ルートハンドラ
 * @author hiroki
 *
 */
public class AjmlHandler extends AbstractHandler{
	public Application app;
	protected void addExpression(Expression exp)
			throws SAXException {
	 this.app = (Application) exp;
	}
	
	
	public void endElement(String uri, String localName,
			String qName) throws SAXException {
	
		return;	
	}
}
