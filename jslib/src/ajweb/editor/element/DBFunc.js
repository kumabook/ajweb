dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.TitlePane");
dojo.require("dijit.form.Select");
dojo.provide("ajweb.editor.element.DBFunc");
dojo.declare("ajweb.editor.element.DBFunc",
	     ajweb.editor.element.Func,
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
    {},
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
	  style:{ position: "absolute", width: "80px",
		  top: properties.top,left: properties.left,
		  backgroundColor: "#E1EBFB", border: "solid 1px #769DC0"
	  },
	  onDblClick: function(){
	    that.store = that.model.application.getDatabaseStore();
	    var tablename = new dijit.layout.ContentPane(
	      {content: "データベース名",
	       style: { position: "absolute", top: "50px", left: "10px"}
	      });
	    var tablenameSelect = new dijit.form.Select(
	      {name: "modelId",value: that.model.properties.database ? that.model.properties.database : "",
	       store: that.store, sortByLabel: false,
	       style: {position : "absolute", width: "150px",top: "50px",left: "100px"}});
	    var button = new dijit.form.Button(
	      { label: "決定",
		style: {position : "absolute",width: "80px",top: "45px",left: "280px"},
		onClick: function(){
		  if(that.model.children.length > 0){
		    that.model.removeParam();
		  }
		  that.model.properties.database = tablenameSelect.value;
		  that.model.createParam(tablenameSelect.value);
		}
	      });
	    that.dialog.containerNode.appendChild(tablenameSelect.domNode);
	    that.dialog.containerNode.appendChild(tablename.domNode);
	    that.dialog.containerNode.appendChild(button.domNode);
	    tablenameSelect.startup();
	    tablename.startup();
	    button.startup();

	    if(that.model.properties.database){
	      that.model.reCreateParamDom();
	    }
	    
	    that.dialog.show();
	    that.dialog.set({style: {left: "200px", top: parseInt(that.dialog.domNode.style.top) - 100 + "px"}});
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
    }
  }
);


