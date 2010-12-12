dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.Value");
dojo.declare("ajweb.editor.element.Value",
	     [ajweb.editor.element.Element],
  /** @lends ajweb.editor.element.Value.prototype */
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
      this.widget =  new dijit.form.Button(
	{ label: "value", 
	  onClick: function(){
	    that.store = that.model.application.getDatabaseStore();//getterリストを取得

	    var elemName = new dijit.layout.ContentPane(
	      { content: "要素名: ",
		style: {position: "absolute",top: "50px",left: "10px"}});
	    var elemSelect = new dijit.form.FilteringSelect(
	      {	name: "modelId", value: that.model.properties.element ? that.model.properties.element : "",
		store: that.store, searchAttr: "name",
		style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
	      });
	    var funcName = new dijit.layout.ContentPane(
	      {content: "関数名: ",
		style: { position: "absolute", top: "75px", left: "10px"}});
	    var funcSelect = new dijit.form.FilteringSelect(
	      {	name: "modelId", value: that.model.properties.func ? that.model.properties.func : "",
		store: that.store, searchAttr: "name",
		style: {position : "absolute",width: "150px",top: "70px",left: "100px"}
	      });
	    var elemButton = new dijit.form.Button(
	      { label: "決定",
		style: {position : "absolute",width: "80px", top: "45px",left: "280px"},
		onClick: function(){
		  that.model.properties.element = elemSelect.value;
		  funcSelect.set({store: that.model.application.WidgetStore});
		}});
	    var funcButton = new dijit.form.Button(
	      { label: "決定",
		style: {position : "absolute",width: "80px", top: "70px",left: "280px"},
		onClick: function(){
		  that.model.properties.func = funcSelect.value;
		  that.model.createParam(that.model.properties.element, that.model.properties.func);
		}});

	    if(that.model.properties.element && that.model.properties.func)
	      that.model.reCreateParamDom();

	    that.dialog.containerNode.appendChild(elemSelect.domNode);
	    that.dialog.containerNode.appendChild(funcSelect.domNode);
	    that.dialog.containerNode.appendChild(elemName.domNode);
	    that.dialog.containerNode.appendChild(funcName.domNode);
	    that.dialog.containerNode.appendChild(elemButton.domNode);
	    that.dialog.containerNode.appendChild(funcButton.domNode);
	    
	    that.dialog.show();
	    var parentDialog = that.model.parent.parent.element.dialog;

	    that.dialog.set({style: {left: parseInt(parentDialog.domNode.style.left) + 400 + "px",
			       top: parseInt(parentDialog.domNode.style.top) - 100 + "px"}});
	  }
	});

      return this.widget.domNode;
    },
    createContainerNode: function(){
      var that = this;
      this.dialog = new dijit.Dialog({
				       title: that.model.parent.properties.name,
				       style: { position: "absolute",
						height: "300px", width: "400px"
					      },
				       onHide: function(){
				       }
				     });
      return this.dialog.containerNode;
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