package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.Primitive;
import ajweb.utils.Log;


/**
 * �N���X�̐��������Ȃ��悤�A�q�v�f�������Ȃ��v�f�ɂ��Ă�Handler���`����B
 * 
 * 
 * @author hiroki
 *
 */
public class PrimitiveHandler extends AbstractHandler {
	
	Primitive primitive;
	public PrimitiveHandler(String qName) {

	}

	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		if(elementName.equals("value")){
    		primitive = new Primitive("value", "");
    		primitive.attributes =  attributes;
    	}
		setExpression(primitive);
		Log.fine("setExpression  " + primitive);
		super.endElement(uri, localName, qName);
	}
	
	@Override
    public void characters(char[] ch, int start, int length)
    	throws SAXException {
    	
    	Log.fine("\t\t\t" + elementName + " chatacters");
    	if(elementName.equals("string")){
    		value = new String(ch, start, length);
    		primitive = new Primitive("string", value);
    	}
    	
    	Log.fine("value set : " + primitive);
    }
	public String toString() {
		return "PrimitiveHandler";
}
}
