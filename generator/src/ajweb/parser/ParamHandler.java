package ajweb.parser;

import org.xml.sax.SAXException;

import ajweb.model.AbstractModel;
import ajweb.model.Param;
import ajweb.model.Parameterable;
import ajweb.model.Primitive;

public class ParamHandler extends AbstractHandler{
	public Param param;
	public Parameterable value;

	@Override
	protected void addModel(AbstractModel model) throws SAXException {
		if(model instanceof Parameterable){
			value  = (Parameterable) model;
		}
		else 
			super.addModel(model);
				
	}
	
		
	@Override
	public void endElement(String uri, String localName, String qName) throws SAXException {
		param = new Param();
		param.key = attributes.get("name");
		param.value = value;
		if(param.value == null)
			param.value = new Primitive("string", attributes.get("value"));
		
		setModel(param);
		super.endElement(uri, localName, qName);
		
	}

}
