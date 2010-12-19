dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dojox.widget.Dialog");
dojo.require("dijit.TitlePane");
dojo.provide("ajweb.editor.element.Login");
dojo.declare("ajweb.editor.element.Login",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Removable],
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
	       style: {position: "absolute",height: "150px", width: "400px"},
	       onHide: function(){
		 delete that.store;
		 this.destroyRecursive();
	       }
	      });
	    var paramContainer = new dijit.layout.ContentPane(
	      { content: "引数",
		style: {position: "absolute",top: "25px", left: "10px",width: "95%", height: "70%"}});
	    dialog.containerNode.appendChild(paramContainer.domNode);
	    that.containerNode = paramContainer.domNode;
	    that.dialog = dialog;

	
	    if(that.model.properties.element && that.model.properties.func)
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
    updateDom: function(properties){
      this.widget.set({
	style:{
	    top: properties.top,
	    left: properties.left
	  }
	});
    },
    removeDom: function(){
      var lines = this.container.lines;
      for(var i = 0; i < lines.length; i++){
	if(lines[i].end == this.domNode){
	  if(i==lines.length-1){
	    this.container.domNode.removeChild(lines[i].domNode);
	    lines.splice(i);
	  }
	  else {
	    for(var j = 0; j < lines.length; j++){
	      if(lines[j].start == this.domNode){
		lines[i].end = lines[j].end;
		this.container.domNode.removeChild(lines[j].domNode);
		lines.splice(j,1);
		this.container.reDraw(lines[i]);
	      }
	    }
	  }
	}
      }
      this.widget.destroyRecursive();
    },
    createMoveTriggerDomNode: function(){
      return this.domNode;
    },

    onDrop: function(){
      this.inherited(arguments);
    },
    startup: function(){
      this.inherited(arguments);
      var that = this;
      this.widget.startup();
      this.model.parent.element.addNewNode(this.domNode);
    }
  }
);


