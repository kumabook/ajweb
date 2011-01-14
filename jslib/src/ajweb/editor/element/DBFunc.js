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
      var a = ajweb.editor;
      var actionName = 	ajweb.editor.getModel(this.model.tagName, "id").name;
      var databaseName = that.model.properties.database ? that.model.properties.database : ajweb.resources.unset;
      var title = actionName + "&nbsp;(" + databaseName+")";
       this.widget = new dijit.TitlePane(
	{
	  title: title,
	  open: false,
	  toggleable: false,
	  style:{ position: "absolute", width: title.length*a.FONT_SIZE+a.REMOVE_ICON_SIZE+"px",
		  top: properties.top,left: properties.left,
		  backgroundColor: "#E1EBFB", border: "solid 1px #769DC0"
	  }
	});
      return this.widget.domNode;
    },
    createDialogContents: function(){
      var that = this;
      var paramContainer = new dijit.layout.ContentPane(
	      {content: "params",
	       style: {position: "absolute",top: "70px", left: "10px",
		       width: this.dialog.style.width, height: this.dialog.style.height,  overflow: "scroll"}});

      that.dialog.containerNode.appendChild(paramContainer.domNode);
      that.containerNode = paramContainer.domNode;

      this.tablename = new dijit.layout.ContentPane(
	{content: ajweb.resources.databaseSelect,
	style: { position: "absolute", top: "30px", left: "10px"}
      });

      that.tablenameSelect = new dijit.form.Select(
	{value: that.model.properties.database ? that.model.properties.database : "",
	store: that.model.application.getDatabaseStore(), sortByLabel: false,
	style: {position : "absolute", width: "150px",top: "25px",left: "100px"}});
      that.button = new dijit.form.Button(
	{ label: ajweb.resources.enter,
	style: {position : "absolute",width: "80px",top: "25px",left: "280px"},
	onClick: function(){
	  if(that.model.children.length > 0){
	    that.model.removeParam();
	  }

	  var model = that.model.application.getElementByPropId(that.tablenameSelect.value);
	  that.model.properties.database = model.properties.id;
	  that.model.setRefProperty();//他のモデルの参照関係を作成
	  that.updateDom();//
	  that.model.createParam(that.tablenameSelect.value);
	}
      });
      that.dialog.containerNode.appendChild(that.tablenameSelect.domNode);
      that.dialog.containerNode.appendChild(that.tablename.domNode);
      that.dialog.containerNode.appendChild(that.button.domNode);

      if(that.model.properties.database){
	that.model.reCreateParamDom();
      }

    },
    updateDom: function(){
      var a = ajweb.editor;
      var actionName = 	ajweb.editor.getModel(this.model.tagName, "id").name;
      var databaseName = this.model.properties.database ? this.model.properties.database : ajweb.resources.unset;
      var title = actionName + "&nbsp;(" + databaseName+")";
      this.widget.set({
	title: title,
	style:{
	  top: this.model.properties.top,
	  left: this.model.properties.left,
	  width: title.length*a.FONT_SIZE+a.REMOVE_ICON_SIZE+"px"
	  }
	});
      if(this.dialog)
	this.dialog.set({title: title});      
    },
    dialogContentsStartup: function(){
      this.tablenameSelect.startup();
      this.tablename.startup();
      this.button.startup();
    }
  }
);


