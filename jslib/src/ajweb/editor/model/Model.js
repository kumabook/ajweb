dojo.provide("ajweb.editor.model.Model");
dojo.declare("ajweb.editor.model.Model", null,
  /** @lends ajweb.editor.model.Model.prototype */
  {
    /**
     * Constructor
     * @class モデルのクラス
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {Array} opt.acceptModelType 子要素に持てる要素
     * @param {Object} opt.properties プロパティのリスト
     * @param {Array} opt.propertyList プロパティ名のリスト
     * @param {String} opt.tagName XMLのタグ名
     * @param {Array} opt.eventList イベントリスト
     * @param {Array} opt.eventNameList イベント名のリスト
     * @param {DOM} opt.parent 配置されるModel
     * @param {ajweb.editor.Editor} opt.editor editorのUIへの参照
     */
    constructor: function(opt)
    {
      /**
       * id
       * @type String
       */
      this.id = opt.id;
      /**
       * プロパティ
       * @type Object
       */
      this.properties = opt.properties;
      /**
       * プロパティ名ののリスト（型情報も含ませる)
       * @type Array
       */
      this.propertyList = opt.propertyList;
      /**
       * 子要素に持つことのできる要素名のリスト
       * @type Array
       */
      this.acceptModelType = opt.acceptModelType;
      /**
       * XMLのタグ名（モデル名）
       * @type String
       */
      this.tagName = opt.tagName;
      /**
       * 子要素の配列
       * @type Array
       */
      this.children = [];
	/**
       * 親モデル
       * @type boolean
       */
      this.parent = opt.parent;
      /**
       *　アプリケーションモデルへの参照
       */
      this.application = opt.application;
      /**
       * GUIへの参照
       */
      this.editor = opt.editor;
//      if(this.parent instanceof ajweb.editor.model.AbstractModel)
      if(this.parent!=undefined)
	this.parent.children.push(this);

    /**
       * イベントリストを保持するcenterTc
       */
      this.eventTc = opt.eventTc;
      this.projectStore = opt.projectStore;
      ajweb.addModel(this);
    },
    /**
     * モデルを削除する。
     */
    remove: function(){
      while(this.children.length != 0){
	this.children[0].remove();
      }
      for(var i = 0; i < this.parent.children.length; i++){
	if(this.parent.children[i] == this)
	  this.parent.children.splice(i,1);
      }
    },
    /**
     * モデルを表すDOMノードを削除する。モデルを削除するタイミングでよびだされる。
     * サブクラスでオーバライドする。
     */
    removeDom: function(){

    },
    /**
     * DOM要素のイベント登録や、スタイルの調整を行う。サブクラスでオーバーライドする。
     */
    startup: function(){
    },
    setRefProperty: function(){
      this._ref = {};
      for(var i = 0; i < this.propertyList.length; i++){
	if(this.propertyList[i].ref){
	  var refProp = this.propertyList[i].refProp;
	  this._ref[refProp] = this.application.getElementByPropId(this.properties[this.propertyList[i].name]);	  
	}
      }
    },
    updateRefProperty: function(model){//propertiesListから自動的に判定してもよい
     for(var i = 0; i < this.propertyList.length; i++){
       if(this.propertyList[i].ref){
	 var refProp = this.propertyList[i].refProp;
	 if(this._ref[refProp] == model){
	   this.properties[this.propertyList[i].name] = model.properties[refProp];
	   this.updateDom();
	   //console.log("update  " + this.id + "  " +  this.propertyList[i].name + "   " + refProp);
	 }
       }
     }
   },
    /**
    * XMLに変換してXMLElementを返す
    * @param {XMLDocument} ウィジェットタイプ
    */
    toXMLElement: function(){
      var xml = ajweb.xml._xml;//createDocument("ajml");
      var node =  xml.createElement(this.tagName);
      for(var i = 0; i < this.propertyList.length; i++){
	var propertyName = typeof this.propertyList[i] == "string"
	  ? this.propertyList[i] : this.propertyList[i].name;
	if(propertyName != "tagName" && propertyName.charAt(0) != "_")
	  if(this.properties[propertyName])
	    node.setAttribute(propertyName, this.properties[propertyName]);
      }
      for(i = 0; i < this.children.length; i++){
	var child = this.children[i].toXMLElement(xml);
	if(child)
	  node.appendChild(child);
      }
      if(this.properties._character)
	node.appendChild(document.createTextNode(this.properties._character));
      return node;
    },
    /**
     * DOMElementの位置なども含めた、xml要素を返す
     */
    toSaveXMLElement: function(xml){
      var node =  xml.createElement(this.tagName);
      var propertyList = dojo.clone(this.propertyList);

      propertyList = propertyList ? propertyList : [];
      propertyList.push("top");
      propertyList.push("left");

      for(var i = 0; i < propertyList.length; i++){
	var propertyName = typeof propertyList[i] == "string"
	  ? propertyList[i] : propertyList[i].name;
	if(this.properties[propertyName])
	  node.setAttribute(propertyName, this.properties[propertyName]);
      }

      for(i = 0; i < this.children.length; i++){
	var child = this.children[i].toSaveXMLElement(xml);
	if(child)
	  node.appendChild(child);
      }

      if(this.properties._character)
	node.appendChild(document.createTextNode(this.properties._character));

      return node;
    },
    xmlToModel: function(node, doc, isDisplay){
      var childNode;
      for(var i = 0; i < node.childNodes.length; i++){
	childNode = node.childNodes[i];
	if(childNode instanceof Element){
	  var attrs = ajweb.editor.getNodeAttributes(childNode);
	  var child, container = this.element;
	  if(childNode.tagName == "databases" ||childNode.tagName == "panel"){//プロジェクトエクスプローラ、およびcenterTcに表示するもの
	    container = this.editor.centerTc;
	  }
	  if(childNode.tagName == "item"){
	    console.log("item" + isDisplay + "  " + container);
	    child = this.editor.createModel(childNode.tagName, attrs, this, container, true);
	    child.xmlToModel(childNode, doc, true);
	  }
	  else {
	    child = this.editor.createModel(childNode.tagName, attrs, this, container, isDisplay);
	    child.xmlToModel(childNode, doc, isDisplay);	    
	  }
	}
      }
    }
  }
);