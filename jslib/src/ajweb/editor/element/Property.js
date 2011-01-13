dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");

dojo.provide("ajweb.editor.element.Property");
dojo.declare("ajweb.editor.element.Property",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Removable
	      ],
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
      this.widget = new dijit.layout.ContentPane(
	{
	  style: {
	    position : "absolute",
	    width: parseInt(this.container.domNode.style.width) - 15 + "px",
	    height: "30px",
	    top: ((this.container.domNode.childNodes.length-1) * 30) + "px",
	    left: "10px"
	  }
	});
      this.propName = new dijit.form.TextBox(
	{
	  name: this.id + "propName",
	  value: properties.name /* no or empty value! */,
	  style: {
	    position : "absolute",
	    width: ajweb.editor.DATABASE_PROPNAME_WIDTH+"px",
	    top: "4px",
	    left: "0px"
	  },
	  onChange: function(){
	    that.model.properties.name = this.value;
	  }

	});
      this.select = new dijit.form.Select(
	{
	  name: "state", value: that.model.properties.type ? that.model.properties.type : "int",
	  store: ajweb.editor.dataTypeStore, sortByLabel: false,
//	  style: {position : "absolute",width: "80px",top: "0px",right: "25px"},
	  style: {position : "absolute",top: "0px", left: ajweb.editor.DATABASE_PROPNAME_WIDTH+10+"px"},
	  onChange: function(){
	    that.model.properties.type = this.value;
	  }
	});

      this.widget.domNode.appendChild(this.propName.domNode);
      this.widget.domNode.appendChild(this.select.domNode);
      this.container.domNode.style.height = (this.model.parent.children.length) * ajweb.editor.DATABASE_PROP_HEIGHT + 35 + "px";

      return this.widget.domNode;
    },
    removeDom: function(){
      this.widget.destroyRecursive();
      this.model.parent.updateDom();
    },

    updateDom: function(){
      for(var i = 0; i < this.model.parent.children.length; i++){
	if(this.model == this.model.parent.children[i]){
	  this.widget.domNode.style.top = (i+1) * 30 + "px";
	}
      }
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
      this.select.startup();
      this.propName.startup();
    }
  }
);


