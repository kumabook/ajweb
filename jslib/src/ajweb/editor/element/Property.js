dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");

dojo.provide("ajweb.editor.element.Property");
dojo.declare("ajweb.editor.element.Property", ajweb.editor.element.Element,
  /** @lends ajweb.editor.element.Property.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {boolean} opt.resizable サイズが変更可能か
     * @param {boolean} opt.movable 位置が変更可能か
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {},
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var that = this;
      var propName = new dijit.form.TextBox(
	{
	  name: this.id + "propName",
	  value: properties.name /* no or empty value! */,
	  style: {
	    position : "absolute",
	    width: "100px",
	    top: "5px",
	    left: "0px"
	  },
	  onChange: function(){
	    that.model.properties.name = this.value;
	  }

	});
      var value = that.model.properties.type ? that.model.properties.type : "int"; 
      var filteringSelect = new dijit.form.FilteringSelect(
	{
	  id: this.id + "select",
	  name: "state",
	  value: value,
	  store: ajweb.editor.dataTypeStore,
	  searchAttr: "name",
	  style: {
	    position : "absolute",
	    width: "70px",
	    top: "5px",
	    right: "10px"
	  },
	  onChange: function(){
	    that.model.properties.type = this.value;
	  }
	});
      this.widget = new dijit.layout.ContentPane(
	{
	  id :this.id,
	  style: {
	    position : "absolute",
	    width: parseInt(this.container.domNode.style.width) - 20 + "px",
	    height: "35px",
	    top: ((this.container.domNode.childNodes.length-1) * 30) + "px",
	    left: "10px"
	  }
	});
      this.widget.domNode.appendChild(propName.domNode);
      this.widget.domNode.appendChild(filteringSelect.domNode);
      this.container.domNode.style.height = (this.container.domNode.childNodes.length-1) * 30 + 35 + "px";
      return this.widget.domNode;
    },
    updateDom: function(properties){
    },
    startup: function(){
      this.widget.startup();
    }
  }
);


