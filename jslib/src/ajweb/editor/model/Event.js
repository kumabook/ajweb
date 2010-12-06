dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Event");

dojo.provide("ajweb.editor.model.Event");
dojo.declare("ajweb.editor.model.Event", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.EventModel.prototype */
  {
    /**
     * Constructor
     * @class イベントモデルのクラス
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {Array} opt.acceptModelType 子要素に持てる要素
     * @param {DOM} opt.parent 配置されるDOM要素
     */
    constructor: function(opt)
    {
      this.conditions = [];
      this.action = [];
      this.target = opt.target;
      this.type = opt.type;
    },
    /**
    * XMLに変換してXMLElementを返す。アクションが設定されていない場合はnullを返す。
    * @param {XMLDocument} ウィジェットタイプ
    */
    toXMLElement: function(){
      var xml = ajweb.xml._xml;//createDocument("ajml");
      var node =  xml.createElement(this.tagName);
      if(this.children.length > 0){
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
      }
      else
	return null;
    }
    /**
     * DOMElementの位置なども含めた、xml要素を返す。アクションが設定されていない場合はnullを返す。
     */
/*    toSaveXMLElement: function(xml){
      var node =  xml.createElement(this.tagName);
      var propertyList = dojo.clone(propertyList);
      propertyList.push("top");
      propertyList.push("left");
      if(this.children.length > 0){
	for(var i = 0; i < propertyList.length; i++){
	  node.setAttribute(propertyList[i], this.properties[propertyList[i]]);
	}

	for(i = 0; i < this.children.length; i++){
	  var child = this.children[i].toXMLElement(xml);
	  if(child)
	    node.appendChild(child);
	}
	return node;
      }
      else
	return null;
    }*/
  }
);
