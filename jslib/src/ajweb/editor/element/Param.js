dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Param");
dojo.declare("ajweb.editor.element.Param", 
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
      var keyTextbox = new dijit.form.TextBox(
	{
	  name: this.id + "paramKeyTextbox",
	  value: properties.name /* no or empty value! */,
	  style: {
	    position : "absolute",
	    width: "110px",
	    top: "5px",
	    left: "0px"
	  },
	  onChange: function(){
	    that.model.properties.name = this.value;
	  }

	});
      var value;
      this.widget = new dijit.layout.ContentPane(
	{
	  id :this.id,
	  style: {
	    position : "absolute",
	    width: parseInt(this.container.domNode.style.width) - 15 + "px",
	    height: "30px",
	    top: (this.model.parent.children.length * 30) + "px",
	    left: "10px"
	  }
	});
      this.widget.domNode.appendChild(keyTextbox.domNode);

      this.container.domNode.style.height = (this.model.parent.children.length) * 30 + 35 + "px";
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
    }
  }
);