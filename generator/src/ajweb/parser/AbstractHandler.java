package ajweb.parser;


import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;


import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.DefaultHandler;

import ajweb.model.Expression;
import ajweb.model.Primitive;
import ajweb.utils.Log;



public abstract class AbstractHandler extends DefaultHandler {
		public Expression expression;

		public static String rootElementName = "ajml";

		HashMap<String, String> attributes;
		String value;
		
		protected XMLReader reader;
        AbstractHandler parent;
        protected Logger mylogger;
		protected String elementName;
		public Attributes attrs;

		protected HashMap</*tablename*/String ,HashMap</*servletname*/String,/*actionname*/HashMap<String,/*param*/HashMap<String,String>>>> servletInfo = 
			new HashMap<String, HashMap<String, HashMap<String,HashMap<String,String>>>>();
		
		
        
		
        static Map<String, HandlerFactory> handlers = new HashMap<String, HandlerFactory>();
        static {//register tagName HandlerFatory
        	
        	handlers.put("application", new HandlerFactory() {//windowHandlerFactory
                public AbstractHandler create() { return new ApplicationHandler(); }});
        	
        	handlers.put("interfaces", new HandlerFactory() {//HandlerFactory
                public AbstractHandler create() { return new InterfacesHandler(); }});
        	handlers.put("databases", new HandlerFactory() {//HandlerFactory
                public AbstractHandler create() { return new DatabasesHandler(); }});
        	handlers.put("events", new HandlerFactory() {//HandlerFactory
                public AbstractHandler create() { return new EventsHandler(); }});
        	
        	handlers.put("window", new HandlerFactory() {//windowHandlerFactory
                public AbstractHandler create() { return new WindowHandler(); }});
        	handlers.put("widget", new HandlerFactory() {
                public AbstractHandler create() { return new WidgetHandler(); }});
        	handlers.put("dbdata", new HandlerFactory() {
                public AbstractHandler create() { return new DBDataHandler(); }});
        	handlers.put("condition", new HandlerFactory() {
                public AbstractHandler create() { return new ConditionHandler(); }});
        	handlers.put("action", new HandlerFactory() {
                public AbstractHandler create() { return new ActionHandler(); }});
        	handlers.put("event", new HandlerFactory() {
                public AbstractHandler create() { return new EventHandler(); }});
        	
        }
        

        /**
         * 構文拡張時に構文要素ハンドラ({@link AbstractHandler.SourceHandler}のサブクラス)
         * を追加/置換する。
         * @param elemName 要素名
         * @param fac 構文要素ハンドラファクトリ
         */
        
        public static void putElementHandler(String elemName, 
                                                HandlerFactory fac) {
            handlers.put(elemName, fac);
        }

        /**
         * 初期設定を行う。オーバーライドする場合は必ず最初に親クラスの呼び出しを行う。
         * @param initReader 現在パーシングに利用しているXMLReader
         * @param initParent 親要素ハンドラ
         * @param attrs この要素の属性
         */
        protected void initialize(XMLReader newReader, AbstractHandler initParent,
                Attributes attrs,String elementName) throws SAXException {
        	
        	reader = newReader;
        	this.attrs = attrs;
        	this.attributes = attrsToHash(attrs);
        	
        	this.elementName = elementName;
        	
            parent = initParent;
        }
        
        public void startElement(String uri, String localName, String qName, Attributes attrs)
            throws SAXException {
        	        	
        	if(qName.equals(rootElementName)){
        		initialize(reader, this, attrs, qName);
        		return;
        	}
        	Log.finest("super "+ qName + " " + this + " elem:" + elementName + " id : " + this.attributes);
        	
            AbstractHandler h;
            HandlerFactory fac = (HandlerFactory)handlers.get(HandlerFactory.handleType(qName));
            if (fac == null) {
                if (Primitive.isElement(qName)) {
                    h = new PrimitiveHandler(qName);
                } else {
                	throw new SAXException("unknown element:" + qName);
                }
            } else {
                h = fac.create();
            }
            
            h.initialize(reader, this, attrs, qName);
            reader.setContentHandler(h);
            

        }
        
        public void endElement(String uri, String localName, String qName)
            throws SAXException {
        	if(!(expression == null))
        		parent.addExpression(expression);
        	Log.finest("super " + " aName  endElement  " + this + "  parent is " +  parent);
            reader.setContentHandler(parent);
        }
        
        protected void setExpression(Expression newExpression) {
            expression = newExpression;
        }
        protected void addExpression(Expression exp) throws SAXException {
        	
        	
            throw new SAXException("no enclosing elements: " + exp);
        }

                
        
        
        public String toString(){
        	return "AbstractHandler";
        }

        public static HashMap<String, String> attrsToHash(Attributes attrs){
        	HashMap<String, String> attributes = new HashMap<String, String>();
        	for(int i = 0; i < attrs.getLength(); i++) {
        		attributes.put(attrs.getQName(i), attrs.getValue(i));
        	}
			return attributes; 
        }
        
}

