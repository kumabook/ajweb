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

//      this.projLabel = opt.projLabel ? opt.projLabel : this.properties.id;
      this.projLabel = opt.projLabel;// ? opt.projLabel : this.properties.id;

      ajweb.addModel(this);
    },
    /**
     * モデルを削除する。
     */
    remove: function(){
      while(this.children.length != 0){//childrenをremove
	this.children[0].remove();
      }
      //親から自分への参照を消す
      ajweb.remove(this, this.parent.children);
    },
    projectRestore: function(){
      if(this.properties._isDisplay){
	this.createDomRecursive();
	this.startup();
      }
  //    else {
	dojo.forEach(this.children,
		     function(v, i ,a){
		       v.projectRestore();
		     }, this);
//      }
    },
    /**
     * モデルを表すDOMノードを削除する。モデルを削除するタイミングでよびだされる。
     * サブクラスでオーバライドする。
     */
    removeDom: function(){

    },
    /**
     * プロジェクトエディタ上のラベル
     */
    getProjLabel: function(){
      return this.projLabel ? this.projLabel : this.properties.id;;
    },
    /**
     * DOM要素のイベント登録や、スタイルの調整を行う。サブクラスでオーバーライドする。
     */
    startup: function(){
    },
    update: function(){
      this.setRefProperty();//参照関係を更新
      if(this.updateDom){
	this.updateDom();
      }
      this.application.updateRefProperty(this);//自分のpropertyを参照しているものがあれば，それも更新
    },
    /**
     * propertyListから外部のモデルを参照しているpropertyのリスト取得してthis._refにセットする
     * newModelの中と，
     */
    setRefProperty: function(){
      this._ref = {};
      dojo.forEach(this.propertyList,
	function(v, i ,a){
	  if(v.ref){
	    var refProp = v.refProp;
	    this._ref[refProp] = this.application.getElementByPropId(this.properties[v.name]);
	  }
      }, this);
    },
    /**
     * modelを参照しているプロパティがあったら、変更を反映する。
     */
    updateRefProperty: function(model){
      dojo.forEach(this.propertyList,
	function(v, i ,a){
	  if(v.ref){
	    var refProp = v.refProp;
	    if(this._ref[refProp] == model){
	      this.properties[v.name] = model.properties[refProp];
	      this.updateDom();
//	      console.log("update  " + this.id + "  " +  this.propertyList[i].name + "   " + refProp);
	    }
	  }
	}, this);
   },
    /**
    * XMLに変換してXMLElementを返す
    * @param {XMLDocument} ウィジェットタイプ
    */
    toXMLElement: function(isSave){
      var xml = ajweb.xml._xml;//createDocument("ajml");
      var node =  xml.createElement(this.tagName);
	var propertyList = dojo.clone(this.propertyList);
      if(isSave){
	propertyList = propertyList ? propertyList : [];
	propertyList.push("top");
	propertyList.push("left");
      }
      dojo.forEach(propertyList,
	function(v, i ,a){
	  var propertyName = typeof v == "string" ? v : v.name;
	  if(propertyName != "tagName" && (isSave || propertyName.charAt(0) != "_"))
	    if(this.properties[propertyName])
	      node.setAttribute(propertyName, this.properties[propertyName]);
	}, this);
      dojo.forEach(this.children,
	function(v, i ,a){
	  var child = v.toXMLElement(isSave);
	  if(child)
	    node.appendChild(child);
	}, this);
      if(this.properties._character)
	node.appendChild(document.createTextNode(this.properties._character));
      return node;
    },
    xmlToModel: function(node, doc){
      var childNode;
      dojo.forEach(node.childNodes,
	function(v, i ,a){
	  if(v.tagName != undefined){// || v instanceof Element){
	    var attrs = ajweb.editor.getNodeAttributes(v);
	    var child, container = this.element;
	    if(v.tagName == "databases" || v.tagName == "panel"){//プロジェクトエクスプローラ、およびcenterTcに表示するもの
	      container = this.editor.centerTc;
	      child = this.editor.createModel(v.tagName, attrs, this, container);
	      child.xmlToModel(v, doc);
	    }
	    else if(v.tagName == "item"){
	      //	    console.log("item" + isDisplay + "  " + container);
	      child = this.editor.createModel(v.tagName, attrs, this, container);
	      child.xmlToModel(v, doc, true);
	    }
	    else {
	      child = this.editor.createModel(v.tagName, attrs, this, container);
	      child.xmlToModel(v, doc);
	    }
	  }
	}, this);
    },
    getChildrenStore: function(store){
      if(!store)
	store = ajweb.editor.getEmptyStore("id", "name");

      for(var i = 0; i < this.children.length; i++){
	store.newItem({name: this.children[i].properties.id, id: this.children[i].properties.id, jsId: this.children[i].id});
      }
      return store;
    },
    validate: function(){
      for(var i = 0; i < this.children.length; i++){
//      console.log(this.id+ "  " + this.children[i].validate());
	if(!this.children[i].validate())
	  return false;
      }

      return true;
    },
    getName: function(){
      return this.properties.id ? this.properties.id : this.id;
    },
    getPath: function(){
      return this.parent.getPath() + "->" + this.getName();
    },
    log: function(message){
      this.editor.logDataStore.newItem(
	{
	  app: this.application.properties.name,
	  path: this.getPath(),
	  message: message
	});
    },
    isIdUsed: function(id, currentModel){
      if(this.properties && this.properties.id == id && this != currentModel){
	return true;	
      }
      for(var i = 0; i < this.children.length; i++){
	if(this.children[i].isIdUsed(id, currentModel))
	  return true;
      }
      
      return false;
    }
  }
);