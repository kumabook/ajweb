dojo.provide("ajweb.editor.model.Model");
dojo.declare("ajweb.editor.model.Model", null,
  /** @lends ajweb.editor.model.Model.prototype */
  {
    /**
     * Constructor
     * @class モデルのクラス
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {Object} opt.properties プロパティのリスト
     * @param {Array} opt.propertyList プロパティ名のリスト
     * @param {String} opt.tagName XMLのタグ名
     * @param {Array} opt.eventList イベントリスト
     * @param {Array} opt.eventNameList イベント名のリスト
     * @param {DOM} opt.parent 配置されるModel
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
      this.acceptComponentType = opt.acceptComponentType;

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
       * 見た目を持つ場合、それを配置する親要素
       * @type dijit._widget
       */
      this.container = opt.container;
//      if(this.parent instanceof ajweb.editor.model.AbstractModel)
      if(this.parent!=undefined)
	this.parent.children.push(this);

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
    * XMLに変換してXMLElementを返す
    * @param {XMLDocument} ウィジェットタイプ
    */
    toXMLElement: function(){
      var xml = ajweb.xml._xml;//createDocument("ajml");
      var node =  xml.createElement(this.tagName);
      for(var i = 0; i < this.propertyList.length; i++){
	node.setAttribute(this.propertyList[i], this.properties[this.propertyList[i]]);
      }
      for(i = 0; i < this.children.length; i++){
	node.appendChild(this.children[i].toXMLElement(xml));
      }
      return node;
    },
    /**
     * DOMElementの位置なども含めた、xml要素を返す
     */
    toSaveXMLElement: function(xml){
      var node =  xml.createElement(this.tagName);
      var propertyList = dojo.clone(propertyList);
      propertyList.push("top");
      propertyList.push("left");
      for(var i = 0; i < propertyList.length; i++){
	node.setAttribute(propertyList[i], this.properties[propertyList[i]]);
      }

      for(i = 0; i < this.children.length; i++){
	node.appendChild(this.children[i].toSaveXMLElement(xml));
      }
      return node;
    }
  }
);
