dojo.require("ajweb.base");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dijit.PopupMenuItem");

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.TitlePane");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.Form");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.Tree");
dojo.require("dijit.tree.dndSource");


dojo.require("dojox.grid.DataGrid");

dojo.require("ajweb.editor.base");
dojo.require("ajweb.editor.model.Model");
dojo.require("ajweb.editor.model.Widget");
dojo.require("ajweb.editor.model.Eventable");
dojo.require("ajweb.editor.model.Database");
dojo.require("ajweb.editor.model.Property");
dojo.require("ajweb.editor.model.Event");
dojo.require("ajweb.editor.element.Databases");
dojo.require("ajweb.editor.element.Database");
dojo.require("ajweb.editor.element.Panel");
dojo.require("ajweb.editor.element.Property");




//dojo.require("ajweb.editor.EventModel");

dojo.provide("ajweb.editor.ModelEditor");


dojo.declare(
  "ajweb.editor.ModelEditor", null,
  /** @lends ajweb.editor.ModelEditor.prototype */
  {
    	/**
	 * Constructor
	 * @class モデルエディターのGUIの外枠を管理するクラス
	 *
	 * @constructs

	 * @param {String} 名前
	 * @param {String} コンテナ用のdiv要素のid
	 * @param {String} menu用のdiv要素のid
	 */

    constructor: function(container_id, menu_id){
      /**
       * コンテナ要素
       * @type dijit.layout.BorderContainer
       */
      this.outerBc = new dijit.layout.BorderContainer(
	{
	  "id": "outerBc",
	  "style": {height: "95%"}
	}, container_id);
      /**
       * メニューバー要素
       * @type dijit.MenuBar
       */
      this.pMenuBar = new dijit.MenuBar({ style: {top: "0px"}}, menu_id);
      this.pSubMenu = new dijit.Menu({});
      this.pSubMenu.addChild(
	new dijit.MenuItem(
	  {
	  label: "UIModel",
	  onClick: function(){
	    var panelModel = new ajweb.editor.model.Panel(
	      {
		id: "panel",
		tagName :"panel",
		properties:
		  {
		    tagName :"panel",
		    id: "panel",
		    content: "",
		    width: "500px",
		    height: "500px"
		  },
		componentType: "panel",
		parent: ajweb.editor.modelEditor.centerTc,
		propertyList: ["tagName","id", "content", "height", "width"],
		eventList: ["onLoad"],
		acceptComponentType:  ["widget"],
		editor: this
	      }
	    );
	    ajweb.editor.modelEditor.projectStore.newItem({name: "panel", modelType: "panel", modelId: panelModel.id});
	  }
	}
      )
    );
    this.pSubMenu.addChild(
      new dijit.MenuItem(
	{
	  label: "データモデル",
	  onClick: function(){
	    var DBModel = new ajweb.editor.model.Eventable(
	      {
		id: "databases",
		tagName :"databases",
		properties:
		  {
		    tagName :"databases"
		  },
		propertyList: ["tagName"],
		eventList: [],
		elementType: "databases",
		container: ajweb.editor.modelEditor.centerTc,
		parent: ajweb.editor.application,
		acceptComponentType: ["database"]
	      }
	    );
	    ajweb.editor.modelEditor.projectStore.newItem({name: "データモデル", modelType: "databases", modelId: DBModel.id});
	  }
	}
      )
    );

    this.pMenuBar.addChild(
      new dijit.PopupMenuBarItem({
      label: "New",
      popup: this.pSubMenu
	}
      )
    );
    this.pSubMenu2 = new dijit.Menu({});
    this.pSubMenu2.addChild(
      new dijit.MenuItem(
	{
	  label: "Ajml File",
	  onClick: function(){
	    ajweb.editor.generate("ajml");
	  }
	}
      )
    );
    this.pSubMenu2.addChild(
      new dijit.MenuItem(
	{
	  label: "Application Archive File (.war)",
	  onClick: function(){
	    ajweb.editor.generate("war");

	  }
	}
      )
    );
    this.pMenuBar.addChild(
      new dijit.PopupMenuBarItem(
	{
	  label: "Generate",
	  popup: this.pSubMenu2

	}
      )
    );


    var logo = document.createElement("p");
    logo.appendChild(document.createTextNode("Ajml Editor"));
    logo.style.position = "absolute";
    logo.style.right = "30px";
    logo.style.top = "-15px";
    this.pMenuBar.domNode.appendChild(logo);
    this.pMenuBar.startup();

    this.mainBc = new dijit.layout.BorderContainer(
      {
	"id": "mainBc",
	"design": "sidebar",
	"region": "center"
      });
    /**
     * ツールボックス用ペイン
     * @type dijit.TitlePane
     */
    this.toolboxCp = new dijit.TitlePane(
      {
	id : "toolboxCp",
	region: "right",
	style: {width: "200px",height: "95%"},
	title: "toolbox",
	toggleable: false
	//,"splitter": "true"
      }
    );

    this.rightBc = new dijit.layout.BorderContainer(
      {
	"id": "ModelRightBc",
	"region": "center"
	,"splitter": "true"
      }
    );
    /**
     * 中央のタブコンテナ
     * @type dijit.layout.TabContainer
     */
    this.centerTc = new dijit.layout.TabContainer(
      {
	"id" : "centerTc",
	"region": "center",
	style: {
	  height: "95%"
	}
	  //							,"splitter": "true"
      }
    );
    this.rightBc.addChild(this.centerTc);

    /**
     * 画面下部のタブコンテナ
     * @type dijit.layout.TabContainer
     */
    this.bottomTc = new dijit.layout.TabContainer(
      {
	region: "bottom",
	style: {height: "200px"},
	splitter: "true"
      }
    );
    /**
     * プロパティエディター部分のペイン
     * @type dijit.layout.ContentPane
     */
    this.propertyCp = new dijit.layout.ContentPane(
      {
    //					      region: "bottom",
      style: {height: "200px"},
      title: "property"
      }
    );
    /**
     * ログ表示部分のペイン
     * @type dijit.layout.ContentPane
     */
    this.logCp = new dijit.layout.ContentPane(
      {
	id:"logCp",
	//					      region: "bottom",
	style: {height: "200px"},
	title: "log"
      }
    );
    /**
     * イベントモデルエディター部分ののペイン
     * @type dijit.layout.TabContainer
     */
    this.eventTc = new dijit.layout.TabContainer(
      {
	tabPosition: "left-h",
	title: "event"
      }
    );


    this.outerBc.addChild(this.mainBc);
    this.mainBc.addChild(this.rightBc);
    this.mainBc.addChild(this.toolboxCp);
    this.rightBc.addChild(this.bottomTc);
    this.bottomTc.addChild(this.propertyCp);
    this.bottomTc.addChild(this.eventTc);
    this.bottomTc.addChild(this.logCp);

    this.outerBc.startup();
    this.mainBc.startup();
    this.rightBc.startup();
    this.toolboxCp.startup();

    /**
     * ツールボックス用のリストを保持するdojoストア
     * @type dojo.data.ItemFileWriteStore
     */
    this.toolboxStore = new dojo.data.ItemFileWriteStore(
      {
	data:
	{
	  identifier: "name",
	  label : "name",
	  items: ajweb.editor.COMLIST
	  }
      }
    );

    this.toolboxTreeModel = new dijit.tree.ForestStoreModel(
	{
	  store: this.toolboxStore,
	  /* query: {
	   "type": "topNode"
	   }, */
	  rootId: "root",
	  rootLabel: "uiComponent",
	  childrenAttrs: ["children"]
	}
      );
      this.toolboxTree = new dijit.Tree(
	{
	  id:"tree",
	  showRoot: false,
	  model: this.toolboxTreeModel,
	  dndController: "dijit.tree.dndSource",
	  getIconClass: function(item, opened){
	    return (!item || this.model.mayHaveChildren(item)) ?
	      (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf";
	  }
	}
      );
      this.toolboxCp.wipeNode.appendChild(this.toolboxTree.domNode);
      this.toolboxTree.dndController.checkAcceptance = function(){ return false;};
      var propertyDataGridStructure =  {
	cells:  [
	  {name: "name", field: "property", width: "30%"},
	  {name: "value", field: "value", width: "auto", editable: "true"}
	]
      };
      /**
       * プロパティエディター部分に表示されるプロパティのリストを保持するdojoストア
       * @type dojo.data.ItemFileWriteStore
       */
     this.propertyDataStore = new dojo.data.ItemFileWriteStore(
	{
	  identifier: "id",
	  data: {  items: []}
	}
      );
      var propertyDataStore = this.propertyDataStore;
      this.propertyDataGrid = new dojox.grid.DataGrid(
	{
	  store: this.propertyDataStore,
	  structure: propertyDataGridStructure,
	  onApplyCellEdit: function(inValue, inRowIndex, inFieldIndex)
	    {
	      var _item = this.getItem(inRowIndex);
	      var item = {};
	      for(var i = 0; i < this.structure.cells.length; i++){
		item[this.structure.cells[i].field] = _item[this.structure.cells[i].field][0];
	      }
	      propertyDataStore.currentModel.properties[item.property] = item.value;

	      console.log("inValue:" + inValue + "   inRowIndex" + inRowIndex +
			  "   inFiledIndex :" + inFieldIndex);
	       propertyDataStore.currentModel.updateDom();//変更されたプロパティをもとにDOMを更新
	    }
	}, dojo.doc.createElement('div'));

      this.propertyDataGrid.placeAt(this.propertyCp.domNode);
      this.propertyDataGrid.startup();

      /**
       * プロジェクトエクスプローラー用のペイン
       * @type dijit.TitlePane
       */
      this.projectExploerBc = new dijit.TitlePane(
	{
	  id : "projectExploerBc",
	  style: {width: "200px", height: "95%"},
	  region: "left",
	  toggleable: false,
	  title: "projectExploer"
	}
      );
      /**
       * プロジェクトエクスプローラー用のリストをのdojoストア
       * @type dojo.data.ItemFileWriteStore
       */
      this.projectStore = new dojo.data.ItemFileWriteStore(
	{
	  data:
	    {
	      identifier: "name",
	      label: "name",
	      items: []
	    }
	}
      );


      this.projectTreeModel = new dijit.tree.ForestStoreModel(
	{
	  store: this.projectStore,
	/*		     query: {
	 "type": "topNode"
		     },*/
	  rootId: "root",
	  rootLabel: "Application",
	  childrenAttrs: ["children"]
	}
      );

      this.projectTree = new dijit.Tree(
	{
	  id:"projecttree",
	  model: this.projectTreeModel,
	  //	showRoot: false,
	  onDblClick : function(item, node, evt){
	    if(!this.model.mayHaveChildren(item)){
//	      var modelName = item.name[0];
	      var children = ajweb.editor.modelEditor.centerTc.getChildren();
	      var isContain = false;
	      var id = item.modelId[0];
	      for(var i = 0; i < children.length ; i++){
		if(children[i].id == id){
		  isContain = true;
//		  id = children[i].id;
		  break;
		}
	      }
	      if(!isContain){
		var model = ajweb.getModelById(id);
		model.reCreateDom(model.properties);
//		ajweb.editor.modelEditor.centerTc.addChild(element.widget);
	      }
	      ajweb.editor.modelEditor.centerTc.selectChild(id);
	    }
	  },
	  getIconClass: function(item, opened){
	    return (!item || this.model.mayHaveChildren(item)) ?
	      (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf";
	  }
	}
      );
      this.projectTree.placeAt(this.projectExploerBc.wipeNode);
      this.outerBc.addChild(this.projectExploerBc);
      /**
       * 作成したajmlを送信するためのform
       * @type dijit.form.Form
       */
      this.generateForm = new dijit.form.Form(
	{
	  id: "generate_form",
	  method: "POST",
	  action: "base"
	});

      /**
       * ファイル名用のテキストボックスを保持
       * @type dijit.form.TextBox
       */
      this.ajmlFilename = new dijit.form.TextBox(
	{id: "filename", name: "filename", value: "sample"}
      );
      this.ajmlFilename.placeAt(this.generateForm.domNode);

      /**
       * 生成するファイルタイプ名のテキストボックスを保持
       * @type dijit.form.TextBox
       */
      this.outputType = new dijit.form.TextBox(
	{id: "output_type", name: "output_type", value: "ajml"}
      );

      this.outputType.placeAt(this.generateForm.domNode);
      /**
       * 生成されたajmlを保持
       * @type dijit.form.Textarea
       */
      this.ajmlTextArea = new dijit.form.Textarea(
	{id: "ajml", name: "content", value: "ajmlさんぷる"}
      );
      this.ajmlTextArea.placeAt(this.generateForm.domNode);
      this.outerBc.domNode.appendChild(this.generateForm.domNode);
      this.generateForm.domNode.style.visibility = "hidden";

      ajweb.editor.form = this.generateForm;
      ajweb.editor.modelEditor = this;
      ajweb.editor.application = new ajweb.editor.model.Model(
				   {
				     id: "application",
				     tagName: "application",
				     properties: { appName: "demo"},
				     propertyList: ["appName"]
				   });
      ajweb.editor.events = new ajweb.editor.model.Model(
				   {
				     id: "events",
				     tagName: "events",
				     properties: {},
				     propertyList: [],
				     parent : ajweb.editor.application
				   });
      ajweb.editor.interfaces = new ajweb.editor.model.Model(
			      {
				id: "interfaces",
				tagName: "interfaces",
				properties: {},
				propertyList: [],
				parent : ajweb.editor.application
			      });

      ajweb.editor.databases = new ajweb.editor.model.Eventable(
	      {
		id: "databases",
		tagName :"databases",
		properties:
		  {
		    tagName :"databases"
		  },
		propertyList: ["tagName"],
		propertyDataStore: this.propertyDataStore,
		eventList: [],
		eventTc: this.eventTc,
		elementType: "databases",
		container: ajweb.editor.modelEditor.centerTc,
		parent: ajweb.editor.application,
		acceptComponentType: ["database"]
	      }
	    );
      ajweb.editor.databases.startup();

      var rootPanel = ajweb.editor.createModel("panel", ajweb.editor.interfaces, this.centerTc, this.propertyDataStore, this.eventTc);
      ajweb.editor.modelEditor.projectStore.newItem({name: "データモデル", modelType: "databases", modelId: ajweb.editor.databases.id});
      var UIModel = ajweb.editor.modelEditor.projectStore.newItem({name: "UIモデル", modelType: "interfaces", modelId: ajweb.editor.interfaces.id});
      this.projectTreeModel.newItem({name: "panel", modelType: "panel", modelId: rootPanel.id}, UIModel);
//      ajweb.editor.modelEditor.projectStore.newItem({name: "test"});

    }

  }
);



