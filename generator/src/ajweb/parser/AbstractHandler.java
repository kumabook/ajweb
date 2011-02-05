package ajweb.parser;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;


import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.DefaultHandler;

import ajweb.model.AbstractModel;
import ajweb.utils.Log;



public abstract class AbstractHandler extends DefaultHandler {
		public AbstractModel model;

		public static String rootElementName = "ajml";

		HashMap<String, String> attributes;
		
		protected XMLReader reader;
        AbstractHandler parent;
        protected Logger mylogger;
		protected String elementName;

		protected HashMap</*tablename*/String ,HashMap</*servletname*/String,/*actionname*/HashMap<String,/*param*/HashMap<String,String>>>> servletInfo = 
			new HashMap<String, HashMap<String, HashMap<String,HashMap<String,String>>>>();
		
		
        
		
        static Map<String, HandlerFactory> handlers = new HashMap<String, HandlerFactory>();
        static {//register tagName HandlerFatory
        	
        	handlers.put("application", new HandlerFactory() {//windowHandlerFactory
                public AbstractHandler create() { return new ApplicationHandler(); }});
        	
        	
        	handlers.put("databases", new HandlerFactory() {//HandlerFactory
                public AbstractHandler create() { return new DatabasesHandler(); }});
        	handlers.put("database", new HandlerFactory() {//HandlerFactory
                public AbstractHandler create() { return new DatabaseHandler(); }});
        	
        	handlers.put("init", new HandlerFactory() {
                public AbstractHandler create() { return new InitHandler(); }});
        	handlers.put("item", new HandlerFactory() {
                public AbstractHandler create() { return new ItemHandler(); }});
        	handlers.put("property", new HandlerFactory() {
                public AbstractHandler create() { return new ParamHandler(); }});
        	handlers.put("initProperty", new HandlerFactory() {
                public AbstractHandler create() { return new ParamHandler(); }});
        	
        	handlers.put("interfaces", new HandlerFactory() {
                public AbstractHandler create() { return new InterfacesHandler(); }});
        	
        	handlers.put("widget", new HandlerFactory() {
                public AbstractHandler create() { return new WidgetHandler(); }});
        	handlers.put("condition", new HandlerFactory() {
                public AbstractHandler create() { return new ConditionHandler(); }});
        	handlers.put("paramCondition", new HandlerFactory() {
                public AbstractHandler create() { return new ConditionHandler(); }});
        	handlers.put("predicate", new HandlerFactory() {
                public AbstractHandler create() { return new PredicateHandler(); }});
        	
        	handlers.put("events", new HandlerFactory() {//HandlerFactory
                public AbstractHandler create() { return new EventsHandler(); }});
        	
        	handlers.put("event", new HandlerFactory() {
                public AbstractHandler create() { return new EventHandler(); }});
        	
        	handlers.put("action", new HandlerFactory() {
                public AbstractHandler create() { return new ActionHandler(); }});
        	handlers.put("branch", new HandlerFactory() {
                public AbstractHandler create() { return new BranchHandler(); }});
        	handlers.put("call", new HandlerFactory() {
                public AbstractHandler create() { return new CallHandler(); }});
        	handlers.put("param", new HandlerFactory() {
                public AbstractHandler create() { return new ParamHandler(); }});
        	
        	handlers.put("value", new HandlerFactory() {
                public AbstractHandler create() { return new ValueHandler(); }});
        	
        	
        	handlers.put("primitive", new HandlerFactory() {
                public AbstractHandler create() { return new PrimitiveHandler(); }});
        	
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
         * @param attrs この要素の属性
         */
        protected void initialize(XMLReader newReader, AbstractHandler initParent,
        		Attributes attrs,String elementName) throws SAXException {
        	
        	reader = newReader;
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
            	throw new SAXException("unknown element:" + qName);
            } else {
                h = fac.create();
            }
            
            h.initialize(reader, this, attrs, qName);
            reader.setContentHandler(h);
        }
        
        public void endElement(String uri, String localName, String qName)
            throws SAXException {
        	if(model != null){
        		parent.addModel(model);
        	}
        	Log.finest("super " + " aName  endElement  " + this + "  parent is " +  parent);
            reader.setContentHandler(parent);
        }
        
        /**
         * expressionこのタグの要素
         * @param newExpression
         */
        protected void setModel(AbstractModel model) {
            this.model = model;
        }
        /**
         * サブクラスでオーバライドする。オーバライドされない場合は、不正なエレメントが子要素にきているので例外をスロー
         * @param exp
         * @throws SAXException
         */
        protected void addModel(AbstractModel model) throws SAXException {
            throw new SAXException("no enclosing elements: " + model);
        }
        
        
        public String toString(){
        	return "AbstractHandler";
        }
        
        /**
         * attrsはすべてのhandlerで共有されているので、それぞれのhandlerのインスタンスごとにHashMapをもたせるための変換メソッド
         * 	@param attrs
         * @return
         */
        public static HashMap<String, String> attrsToHash(Attributes attrs){
        	HashMap<String, String> attributes = new HashMap<String, String>();
        	for(int i = 0; i < attrs.getLength(); i++) {
        		attributes.put(attrs.getQName(i), attrs.getValue(i));
        	}
			return attributes; 
        }
        
}

