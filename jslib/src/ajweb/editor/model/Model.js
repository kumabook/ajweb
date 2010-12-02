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
      for(var i = 0; i < this.parent.children.length; i++){
	if(this.parent.children[i] == this)
	  this.parent.children.splice(i,1);
      }
    },
    /**
     * DOM要素のイベント登録や、スタイルの調整を行う。サブクラスでオーバーライドする。
     */
    startup: function(){
    },
    /**
    * XMLに変換してXMLElementを返す
    * @param {XMLDocument} ウィジェットタイプ
    */
    toXMLElement: function(){
      var xml = ajweb.xml._xml;//createDocument("ajml");
      var node =  xml.createElement(this.tagName);
      for(var i = 0; i < this.propertyList.length; i++){
	if(this.propertyList[i] != "tagName")
	  node.setAttribute(this.propertyList[i], this.properties[this.propertyList[i]]);
      }
      for(i = 0; i < this.children.length; i++){
	var child = this.children[i].toXMLElement(xml);
	if(child)
	  node.appendChild(child);
      }
      return node;
    },
    /**
     * DOMElementの位置なども含めた、xml要素を返す
     */
    toSaveXMLElement: function(xml){
      var node =  xml.createElement(this.tagName);
      var propertyList = dojo.clone(this.propertyList);
      propertyList.push("top");
      propertyList.push("left");
      for(var i = 0; i < propertyList.length; i++){
	if(this.properties[propertyList[i]])
	  node.setAttribute(propertyList[i], this.properties[propertyList[i]]);
      }
      for(i = 0; i < this.children.length; i++){
	var child = this.children[i].toSaveXMLElement(xml);
	if(child)
	  node.appendChild(child);
      }
      return node;
    },
    xmlToModel: function(xml){
      var childNode;
      for(var i = 0; i < xml.childNodes.length; i++){
	childNode = xml.childNodes[i];
	var attrs = {};
	if(childNode instanceof Element){
	  for(var j = 0; j < childNode.attributes.length; j++){
	    attrs[childNode.attributes[j].name] = childNode.attributes[j].value;
	  }
	  var child;
	  if(childNode.tagName == "databases" ||childNode.tagName == "panel"){//プロジェクトエクスプローラ、およびcenterTcに表示するもの
	    child = this.editor.createModel(childNode.tagName, attrs, this, this.editor.centerTc);
	  }
	  else {
	    child = this.editor.createModel(childNode.tagName, attrs, this, this.element);
	  }
	  child.xmlToModel(childNode);
	}
      }
    }
  }
);