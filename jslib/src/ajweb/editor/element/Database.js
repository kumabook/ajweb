dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");

dojo.require("ajweb.editor.element.Element");

dojo.provide("ajweb.editor.element.Database");
dojo.declare("ajweb.editor.element.Database", ajweb.editor.element.Element,
  /** @lends ajweb.editor.element.Database.prototype */
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
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      properties.tablename = this.id;
      this.widget = new dijit.layout.ContentPane(
	{
	  id : this.id,
	  style:{
	    position: "absolute",
	    width: "170px",
	    height: "40px",
	    top: properties.top,
	    left: properties.left,
	    backgroundColor: "#E1EBFB",
	    border: "solid 1px #769DC0"
	  }
	});
      this.tablename = document.createElement("div");
      this.tablename.className = "dijitDialogTitleBar";
      this.tablename.innerHTML  = properties.tablename;
      this.widget.domNode.appendChild(this.tablename);
      this.deleteArea = document.createElement("div");
      this.deleteArea.className = "dijitDialogCloseIcon";
      this.widget.domNode.appendChild(this.deleteArea);
      return this.widget.domNode;
    },
    updateDom: function(properties){
      this.widget.set({
	style:{
	    top: properties.top,
	    left: properties.left
	  }
	});
      this.tablename.innerHTML  = properties.tablename;
    },
    startup: function(){
      dojo.connect(this.widget.domNode, "onmousedown", this.model, this.model.updatePropertiesView);
      dojo.connect(this.widget.domNode, "onmousedown", this.model, this.model.updateEventView);
      dojo.connect(this.deleteArea, "onclick", this.model, this.model.remove());
      this.dndEnable();
      this.enableDragMove();
      this.widget.startup();
    }
  }
);


