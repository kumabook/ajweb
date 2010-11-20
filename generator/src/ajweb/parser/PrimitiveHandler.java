package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.Primitive;
import ajweb.utils.Log;

/**
 * クラスの数が増えないよう、子要素を持たない要素についてのHandlerを定義する。
 * 
 * 
 * @author hiroki
 *
 */
public class PrimitiveHandler extends AbstractHandler {
	
	Primitive primitive;
	String character;
	

	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		if(elementName.equals("int") || elementName.equals("string") || elementName.equals("text")
				|| elementName.equals("boolean")){
			primitive = new Primitive(elementName, character);
		}
				
		else if(elementName.equals("datetime") || elementName.equals("time") || elementName.equals("date")){
			primitive = new Primitive(elementName, attributes);
		}
		else if(elementName.equals("img")){
			primitive = new Primitive(elementName, attributes);
		}
		else if(elementName.equals("video")){
			primitive = new Primitive(elementName, attributes);
		}
		else if(elementName.equals("element")){

			if(attributes.containsKey("property"))
				character =  character + "." + attributes.get("property");
			primitive = new Primitive(elementName, character);
		}
		
		setExpression(primitive);
		Log.fine("setExpression  " + primitive);
		super.endElement(uri, localName, qName);
	}
	
	@Override
    public void characters(char[] ch, int start, int length)
    	throws SAXException {
		Log.fine("\t\t\t" + elementName + " chatacters");
   		character = new String(ch, start, length);
    	Log.fine("value set : " + primitive);
    }
	
	public String toString() {
		return "PrimitiveHandler";
	}
}