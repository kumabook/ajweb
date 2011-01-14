dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");
dojo.require("ajweb.datetime");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Datetime");
dojo.declare("ajweb.editor.element.Datetime",
	     [ajweb.editor.element.Element],
  /** @lends ajweb.editor.element.Datetime.prototype */
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

      var date, time;
      if(this.model.properties._character){
	var dateTime = ajweb.datetime.parse(this.model.properties._character);
	date = dateTime;
	time = dateTime;
	}
      if(!date) date = new Date();
      if(!time) time = new Date();
      
      var dateInput = new dijit.form.DateTextBox(
	{style: {position: "absolute", width: "90px", top: "0px", left: "0px"},
	 value: date,
	 onChange: function(){
	   date = this.value;
	   that.model.properties._character = ajweb.datetime.format(date, time);
	 }
	});
      var timeInput = new dijit.form.TimeTextBox(
	{style: {position: "absolute", width: "50px", top: "0px", left: "110px"},
	 value: time,
	 onChange: function(){
	   time = this.value;
	   that.model.properties._character = ajweb.datetime.format(date, time);
	 }
	});
      
      this.widget = new dijit.layout.ContentPane(
	{style: {position: "absolute", height: "50px", width: "200px", top: "5px"}
	});
      this.widget.domNode.appendChild(dateInput.domNode);
      this.widget.domNode.appendChild(timeInput.domNode);
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