dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
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
	    var typeName = new dijit.layout.ContentPane(
	      { content: "値の種類: ",
		style: {position: "absolute",top: "30px",left: "10px"}});
	    var typeSelect = new dijit.form.Select(
	      {	name: "modelId", value: that.model.properties.element ? that.model.properties.element : "",
//		store: ajweb.editor.valueTypeStore, sortByLabel: false,
		store: that.model.application.getValueStore(), sortByLabel: false,
		style: {position : "absolute",width: "150px",top: "30px",left: "100px"}
	      });

	    var typeButton = new dijit.form.Button(
	      { label: "決定", 
		style: {position : "absolute",width: "80px", top: "30px",left: "280px"},
		onClick: function(){
		  that.model.properties.element = typeSelect.value;
//		  funcSelect.set({store: that.model.application.WidgetStore});
		  var model = ajweb.getModelById(typeSelect.value);
		  ajweb.editor.updateGetterStore(model.properties.tagName, funcSelect.store);
		  funcButton.set({ disabled: false});
		  this.set({label: "変更"});
		}});

	    var funcName = new dijit.layout.ContentPane(
	      {content: "関数名: ",
		style: { position: "absolute", top: "80px", left: "10px"}});
	    var funcSelect = new dijit.form.Select(
	      {	name: "modelId", value: that.model.properties.func ? that.model.properties.func : "",
//		store: that.store, searchAttr: "name",
		store: new dojo.data.ItemFileWriteStore({ data: { identifier: "name", label : "name", items: []}}), searchAttr: "name",
		style: {position : "absolute",width: "150px",top: "80px",left: "100px"}
	      });

	    var funcButton = new dijit.form.Button(
	      { label: "決定", disabled: true,
		style: {position : "absolute",width: "80px", top: "80px",left: "280px"},

		onClick: function(){
		  that.model.properties.func = funcSelect.value;
		  that.model.createParam(that.model.properties.element, that.model.properties.func);
		  this.set({label: "変更"});
		}});

	    if(that.model.properties.element && that.model.properties.func)
	      that.model.reCreateParamDom();

	    that.dialog.containerNode.appendChild(typeSelect.domNode);

	    that.dialog.containerNode.appendChild(funcSelect.domNode);
	    that.dialog.containerNode.appendChild(typeName.domNode);

	    that.dialog.containerNode.appendChild(funcName.domNode);
	    that.dialog.containerNode.appendChild(typeButton.domNode);
	    that.dialog.containerNode.appendChild(funcButton.domNode);
	    
	    typeName.startup();
	    funcName.startup();
	    typeSelect.startup();
	    funcSelect.startup();
	    typeButton.startup();
	    funcButton.startup();

	    that.dialog.show();
	    var parentDialog = that.model.parent.parent.element.dialog;
	    that.dialog.set({style: {left: parseInt(parentDialog.domNode.style.left) + 300 + "px",
			       top: parseInt(parentDialog.domNode.style.top) - 50 + "px"}});

	    that.dialog.containerNode.style.width = that.dialog.domNode.style.width;
	    that.dialog.containerNode.style.height = that.dialog.domNode.style.height;
	  }
	});

      var tagName = this.model.parent.tagName;
      if(tagName == "eq" || tagName == "gt" || tagName == "lt")
	this.widget.set({style: {position: "absolute",
				 left: (this.container.containerNode.childNodes.length-1) * 120 + "px"}});
      
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