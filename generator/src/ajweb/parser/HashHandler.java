package ajweb.parser;

import java.util.HashMap;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import ajweb.model.Expression;
import ajweb.model.Hash;
import ajweb.model.Primitive;
import ajweb.model.ToJSONAble;
import ajweb.utils.Log;

/**
 * hashタグが現れた時のハンドラ
 * @author hiroki
 *
 */
public class HashHandler extends AbstractHandler {

	Hash hash = new Hash();	
	String property = "default";
	HashMap<String, ToJSONAble> properties = new HashMap<String, ToJSONAble>();
	
	
	public void startElement(
			String uri, String localName, String qName,
			Attributes attrs) throws SAXException {
		Log.fine("\t" + this + " start " + "  uri: " + uri + "element :" + qName);
	
		if(qName == "pram"){
//			properties.put(attrs.getValue("name"), attrs.getValue("type"));
			property = qName;// addExpressionで追加される値のkeyを一時的に保存
		}
		else 
			super.startElement(uri, localName, qName, attrs);
	}
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Primitive){
			Primitive value = (Primitive) exp;
			this.properties.put(property, value);
		}
		
	}
	public void endElement(
			String uri, String localName, String qName) throws SAXException{
		Log.fine("\t" + this + " end " + "  uri: " + uri + "element :" + qName);
		
		if(qName == "hash"){
			hash.hash = properties;
			setExpression(hash);
			super.endElement(uri, localName, qName);
		}
	}
	
	public String toString(){
		return "HashHandler";
	}
}


