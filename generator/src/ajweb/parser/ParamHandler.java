package ajweb.parser;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import ajweb.model.Expression;
import ajweb.model.Param;
import ajweb.model.Primitive;

public class ParamHandler extends AbstractHandler{
	public Param param;
	public Primitive value;
	
	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes attrs) throws SAXException {
		
		super.startElement(uri, localName, qName, attrs);
	}
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Primitive){
			value  = (Primitive) exp;
		}
				
	}
	
		
	@Override
	public void endElement(String uri, String localName, String qName) throws SAXException {
		
		param = new Param();
		param.key = attributes.get("name");
		param.value = value;

		setExpression(param);
		super.endElement(uri, localName, qName);
		
	}

}
