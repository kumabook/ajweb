dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Date");
dojo.declare("ajweb.editor.element.Date",
	     [ajweb.editor.element.Element],
  /** @lends ajweb.editor.element.Date.prototype */
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

      var date;
      if(this.model.properties._character){
	date = ajweb.date.parse(this.model.properties._character);
      }
      if(!date) date = new Date();
      console.log(date);
      this.widget = new dijit.form.DateTextBox(
	{style: {position: "absolute", width: "200px", top: "5px"},
	 value: date,
	 onChange: function(){
	   that.model.properties._character = ajweb.date.format(this.value);
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