dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.StringSelect");
dojo.declare("ajweb.editor.element.StringSelect",
	     [ajweb.editor.element.Element],
  /** @lends ajweb.editor.element.StringSelect.prototype */
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
      var store;

      //todo modelから
      if(that.model.properties.type == "data"){//databaseのスキーマを参照
	if(that.model.properties.target){
	  var databaseModel = this.model.application.getElementByPropId(that.model.properties.target);
	  store = databaseModel.getSchemeStore();
	}
      }

      this.widget = dijit.form.Select(
	{style: {position: "absolute", top: "3px"},
	 store: store,
	 value: that.model.properties._character ? that.model.properties._character: "",
	 onChange: function(){
	   that.model.properties._character = this.value;
	 }
	});
      return this.widget.domNode;
    },
    removeDom: function(){
      this.widget.destroyRecursive();
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);