package ajweb.parser;

import java.util.ArrayList;


import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

import ajweb.Config;
import ajweb.model.Action;
import ajweb.model.Application;
import ajweb.model.Databases;
import ajweb.model.Events;
import ajweb.model.Expression;
import ajweb.model.Widget;
import ajweb.utils.Log;

/**
 * ajml ÇÃ applicaitonÉGÉåÉÅÉìÉgèàóùópHandler 
 * @author hiroki
 *
 */

public class ApplicationHandler extends AbstractHandler {
	Application application;
		

	/*static String workDirectory;
	static String appName;
	static {
		workDirectory = Main.workDirectory;
		appName = Main.appName;
	}
	*/
	ArrayList<String> servlet = new ArrayList<String>();;
	
	@Override
	protected void initialize(XMLReader newReader, AbstractHandler initParent,
			Attributes attrs, String elementName) throws SAXException {
			
		super.initialize(newReader, initParent, attrs, elementName);
		//System.out.println("application    " + attributes.get("name"));
		application = new Application(attributes.get("name"), Config.workDir);
	}
	@Override
	protected void addExpression(Expression exp) throws SAXException {
		if (exp instanceof Widget)
			this.application.widgets.add((Widget) exp);
		else if (exp instanceof Databases){
			this.application.databases = ((Databases) exp);
		}
		else if (exp instanceof Action)
			this.application.dbActions.add((Action) exp);
		else if (exp instanceof Events)
			this.application.events = (Events) exp;
	}
	
	@Override
	public void endElement(
		String uri, String localName, String qName) throws SAXException{
		Log.fine("ApplicaitonHandler endElement:" + qName);
		setExpression(application);
		super.endElement(uri, localName, qName);
	}
	
	public void generate(){
		this.application.generate();
	}
	
	public String toString(){
		return "ApplicaitonHandler";
	}
}
