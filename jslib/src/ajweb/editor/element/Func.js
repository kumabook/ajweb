dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dojox.widget.Dialog");
dojo.require("dijit.TitlePane");
dojo.provide("ajweb.editor.element.Func");
dojo.declare("ajweb.editor.element.Func",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.DndEnable,
	      ajweb.editor.element.Movable,
	      ajweb.editor.element.Removable],
  /** @lends ajweb.editor.element.Func.prototype */
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
	    that.store = that.model.application.getDatabaseStore();    
	    var elemName = new dijit.layout.ContentPane(
	      { content: "要素名: ",
		style: {position: "absolute",top: "50px",left: "10px"}});
	    var elemSelect = new dijit.form.Select(
	      {	name: "modelId", value: that.model.properties.element ? that.model.properties.element : "",
		store: that.store, sortByLabel: false,
		style: {position : "absolute",width: "150px",top: "50px",left: "100px"}
	      });
	    var funcName = new dijit.layout.ContentPane(
	      {content: "関数名: ",
		style: { position: "absolute", top: "75px", left: "10px"}});
	    var funcSelect = new dijit.form.Select(
	      {	name: "modelId", value: that.model.properties.func ? that.model.properties.func : "",
		store: that.store, sortByLabel: false,
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
	    
	    elemSelect.startup();
	    funcSelect.startup();
	    elemenName.startup();
	    funcName.startup();
	    elemButton.startup();
	    funcButton.startup();

	    that.dialog.show();
	    that.dialog.set({style: {left: "200px", top: parseInt(that.dialog.domNode.style.top) - 50 + "px"}});
	  }
	});
      this.widget.element = this;
      //ドロップ要素を更新

      this.model.parent.element.widget.set(
	  { style: {
	      top: this.model.parent.properties.top,
	      left: parseInt(this.model.parent.properties.left) + 250 + "px" 
	    }
	  });

      return this.widget.domNode;
    },
    createContainerNode: function(){
      var that = this;
      this.dialog = new dijit.Dialog({
//      this.dialog = new dojox.widget.Dialog({
				       title: that.model.tagName,
				       style: {position: "absolute",
						    height: "300px", width: "400px"
					      },
				       onHide: function(){
					 delete that.store;
					 that.model.removeParamDom();
				       }
				     });
      this.paramContainer = new dijit.layout.ContentPane({
							   content: "params",
							   style: { 
							     position: "absolute",
							     top: "70px", left: "10px",
							     border: "dotted 1px",
							     width: "95%", height: "70%"
							   }
							 });

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


