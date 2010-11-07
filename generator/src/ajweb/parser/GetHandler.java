package ajweb.parser;

import java.util.ArrayList;


import org.xml.sax.SAXException;

import ajweb.model.Expression;
import ajweb.model.Get;
import ajweb.model.Param;
import ajweb.model.Parameterable;
import ajweb.model.ReceivedItem;
import ajweb.model.TargetItem;

public class GetHandler extends AbstractHandler{
	Expression get;
	ArrayList<Param> params = new ArrayList<Param>();
	Parameterable param;
	
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if(exp instanceof Param){
			params.add((Param) exp); 
		}
		else if(exp instanceof Parameterable){
			param = (Parameterable) exp;
		}
	}
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		if(qName.equals("get")){
			String property = attributes.get("property");
			String getter = "get" + property.substring(0, 1).toUpperCase() + property.substring(1).toLowerCase();
			get = new Get(attributes.get("element"), getter);
		}
		else if(qName.equals("selectById")){
			get = new Get(attributes.get("database"), "selectById");
		}
		else if(qName.equals("selectByCondition")){
			get = new Get(attributes.get("database"), "selectByCondition");
		}
		else if(qName.equals("targetItem")){
			String property = attributes.get("property");
			if(property == null)
				property = "";
			get = new TargetItem(property);
		}
		else if(qName.equals("receivedItem")){
			String property = attributes.get("property");
			if(property == null)
				property = "";
			get = new ReceivedItem(property);
		}
		else if(qName.equals("math")){
		//‚Ü‚¾–¢ŽÀ‘•	
		}
		setExpression(get);
		super.endElement(uri, localName, qName);
	}
}
