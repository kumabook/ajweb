dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("ajweb.editor.element.TitlePane");
dojo.require("dijit.TitlePane");
dojo.provide("ajweb.editor.element.DBFunc");
dojo.declare("ajweb.editor.element.DBFunc",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Removable],
  /** @lends ajweb.editor.element.DBFunc.prototype */
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
	{
	  title: this.model.tagName,
	  open: false,
	  toggleable: false,
	  style:{
	    position: "absolute",
	    width: "80px",
	    top: properties.top,
	    left: properties.left,
	    backgroundColor: "#E1EBFB",
	    border: "solid 1px #769DC0"
	  },
	  onDblClick: function(){
	    that.dialog.show();
	  }
	});
      this.widget.element = this;
//      this.widget.domNode.className = "dijitTitlePaneTitle";
      return this.widget.domNode;
    },
    createContainerNode: function(){
	    this.dialog = new dijit.Dialog({
					    title: "アクション",
					    toggleable: false,
					    style: {position: "absolute",
						    height: "60%", width: "50%"
						   }
					  });


	    var tablename = new dijit.layout.ContentPane({
							   content: "tablename",
							   style: { 
							     position: "absolute",
							     top: "50px",
							     left: "10px"
							 }
						      });

	    var tablenameSelect = new dijit.form.FilteringSelect({
							     value: "",
							     store: ajweb.editor.databaseModelStore,
							     searchAttr: "name",
							     style: {
							       position : "absolute",
							       width: "150px",
							       top: "50px",
							       left: "100px"
							     },
							     onChange: function(){
							       that.model.properties.type = this.value;
							     }
							   });

	    var button = new dijit.form.Button({
						 label: "決定",
						 style: {
						   position : "absolute",
						   width: "80px",
						   top: "45px",
						   left: "280px"
						 }
					       });

	    this.paramContainer = new dijit.layout.ContentPane({
							   content: "params",
							   style: { 
							     position: "absolute",
							     top: "100px", left: "10px",
							     border: "dotted 1px",
							     width: "95%", height: "70%"
							 }
						      });
	    this.dialog.containerNode.appendChild(tablenameSelect.domNode);
	    this.dialog.containerNode.appendChild(tablename.domNode);
	    this.dialog.containerNode.appendChild(button.domNode);
	    this.dialog.containerNode.appendChild(this.paramContainer.domNode);

      return this.paramContainer.domNode;
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
/*    createDndDomNode: function(){
      return this.widget.hideNode;
    },*/
/*    createContainerNode:function(){
      return this.widget.hideNode;
    },*/
    onDrop: function(){
      this.inherited(arguments);
    },
    startup: function(){
      this.inherited(arguments);
      var that = this;
      this.widget.startup();
    }
  }
);


