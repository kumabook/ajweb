package ajweb.parser;

import java.util.HashMap;

import org.xml.sax.SAXException;

import ajweb.model.Application;
import ajweb.model.AbstractModel;

/**
 * ���[�g�n���h��
 * @author hiroki
 *
 */
public class AjmlHandler extends AbstractHandler{
	public Application app;
	protected void addModel(AbstractModel model)
			throws SAXException {
	 this.app = (Application) model;
	}
	
	
	public void endElement(String uri, String localName,
			String qName) throws SAXException {
		WidgetHandler.widgetList = new HashMap<String, Integer>();
		return;	
	}
}
