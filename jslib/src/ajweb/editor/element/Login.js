dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dojox.widget.Dialog");
dojo.require("dijit.TitlePane");
dojo.provide("ajweb.editor.element.Login");
dojo.declare("ajweb.editor.element.Login",
	     [
	       ajweb.editor.element.Func
	     /*  ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Removable*/
	     ],
  /** @lends ajweb.editor.element.Login.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs
     * @borrows ajweb.editor.element.Element#id this.id
     * @borrows ajweb.editor.element.Element#model this.model
     * @borrows ajweb.editor.element.Element#title this.title
     * @borrows ajweb.editor.element.Element#container this.container
     * @borrows ajweb.editor.element.Element#domNode this.domNode
     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {
    },
    /**
     * DOM要素を作成し、作成したDOMノードを返す。
     */
    createDom: function(properties){
      var that = this;
       this.widget = new dijit.TitlePane(
	{ title: this.model.tagName, open: false, toggleable: false,
	  style:{position: "absolute", width: "80px",top: properties.top, left: properties.left,
		 backgroundColor: "#E1EBFB",border: "solid 1px #769DC0" },
	  onDblClick: function(){
	    var dialog = new dijit.Dialog(
	      {title: that.model.tagName,
	       style: {position: "absolute",height: "120px", width: "450px"},
	       onHide: function(){
		 delete that.store;
		 this.destroyRecursive();
	       }
	      });
	    var paramContainer = new dijit.layout.ContentPane(
	      { //content: "引数",
		style: {position: "absolute",top: "30px", left: "0px",width: "450px", height: "90px"}});
	    dialog.containerNode.appendChild(paramContainer.domNode);
	    that.containerNode = paramContainer.domNode;
	    that.dialog = dialog;

	    if(that.model.children.length > 0)
	      that.model.reCreateParamDom();
	    else
	      that.model.createParam();

	    dialog.show();
	    dialog.set({style: {left: "200px", top: parseInt(dialog.domNode.style.top) - 50 + "px"}});

	    dialog.containerNode.style.width = dialog.domNode.style.width;
	    dialog.containerNode.style.height = dialog.domNode.style.height;
	  }
	});
      this.widget.element = this;
      //ドロップ要素を更新

      if(this.model.parent.element)
	this.model.parent.element.widget.set(
	  { style: {
	      top: this.model.parent.properties.top,
	      left: parseInt(this.model.parent.properties.left) + 250 + "px"
	    }
	  });

      return this.widget.domNode;
    },
    updateDom: function(){
      this.widget.set({
	style:{
	    top: this.model.properties.top,
	    left: this.model.properties.left
	  }
	});
    },
    startup: function(){
      this.inherited(arguments);
    }
  }
);


