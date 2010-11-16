package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.Expression;
import ajweb.model.Param;
import ajweb.model.Parameterable;
import ajweb.model.Primitive;

public class ParamHandler extends AbstractHandler{
	public Param param;
	public Parameterable value;

	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Parameterable){
			value  = (Parameterable) exp;
		}
				
	}
	
		
	@Override
	public void endElement(String uri, String localName, String qName) throws SAXException {
		param = new Param();
		param.key = attributes.get("name");
		param.value = value;
		if(param.value == null)
			param.value = new Primitive("string", attributes.get("value"));
		
		setExpression(param);
		super.endElement(uri, localName, qName);
		
	}

}
