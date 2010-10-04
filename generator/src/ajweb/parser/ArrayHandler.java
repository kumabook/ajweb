package ajweb.parser;


import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import ajweb.model.Array;
import ajweb.model.Expression;
import ajweb.model.Primitive;
import ajweb.utils.Log;

/**
 * arrayタグが現れた時のハンドラ
 * @author hiroki
 *
 */
public class ArrayHandler extends AbstractHandler {
	
		Array array = new Array();	
				
		
		public void startElement(
				String uri, String localName, String qName,
				Attributes attrs) throws SAXException {
			Log.fine("\t" + this + " start " + "  uri: " + uri + "element :" + qName);
		
			super.startElement(uri, localName, qName, attrs);
		}
		
		@Override
		protected void addExpression(Expression exp) throws SAXException {
			if(exp instanceof Primitive){
				Primitive value = (Primitive) exp;
				this.array.array.add(value);
			}
			
		}
			
		public void endElement(
				String uri, String localName, String qName) throws SAXException{
			Log.fine("\t" + this + " end " + "  uri: " + uri + "element :" + qName);
			
			if(qName == "array"){
				setExpression(array);
				super.endElement(uri, localName, qName);
			}
		}
		
		public String toString(){
			return "HashHandler";
		}
}


