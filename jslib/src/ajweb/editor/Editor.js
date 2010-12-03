dojo.require("ajweb.base");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dijit.PopupMenuItem");
dojo.require("dojox.form.FileUploader");
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
dojo.require("ajweb.editor.model.Application");
dojo.require("ajweb.editor.model.Widget");
dojo.require("ajweb.editor.model.Th");
dojo.require("ajweb.editor.model.Eventable");
dojo.require("ajweb.editor.model.Database");
dojo.require("ajweb.editor.model.Property");
dojo.require("ajweb.editor.model.Event");
dojo.require("ajweb.editor.element.Widget");
dojo.require("ajweb.editor.element.Table");
dojo.require("ajweb.editor.element.Databases");
dojo.require("ajweb.editor.element.Database");
dojo.require("ajweb.editor.element.Panel");
dojo.require("ajweb.editor.element.Button");
dojo.require("ajweb.editor.element.Label");
dojo.require("ajweb.editor.element.Property");



dojo.provide("ajweb.editor.Editor");


dojo.declare(
  "ajweb.editor.Editor", null,
  /** @lends ajweb.editor.Editor.prototype */
  {
    /**
     * Constructor
     * @class モデルエディターのGUIを管理するクラス
     *
     * @constructs
     * @param {String} 名前
     */
    constructor: function(name){
      this.name = name;
      var that = this;
      var container = document.createElement("div");
      var menu = document.createElement("div");
      document.body.appendChild(menu);
      document.body.appendChild(container);
      /**
       * アプリケーションのリスト
       */
      this.applications = [];
      /**
       * コンテナ要素
       * @type dijit.layout.BorderContainer
       */
      this.outerBc = new dijit.layout.BorderContainer(
	{
	  "style": {height: "95%"}
	}, container);
      /**
       * メニューバー要素
       * @type dijit.MenuBar
       */
      this.pMenuBar = new dijit.MenuBar({ style: {top: "0px"}}, menu);
      this.pSubMenu = new dijit.Menu({});
      this.pSubMenu.addChild(new dijit.MenuItem({label: "New", onClick: function(){
						 that.newDialog.show();  
						 }
						}));
      this.pSubMenu.addChild(new dijit.MenuItem({label: "Open File", onClick: function(){
						   that.openFile();
						 }}));
      this.pMenuBar.addChild(new dijit.PopupMenuBarItem({label: "File",popup: this.pSubMenu}));
      this.pSubMenu2 = new dijit.Menu({});
      this.pSubMenu2.addChild(new dijit.MenuItem({label: "Save File",onClick: function(){
						    //todo 複数ある場合は判定をここでおこなう
						    that.saveAjml(that.application, "ajml", "demo");						   
						  }}));
      this.pSubMenu2.addChild(new dijit.MenuItem({label: "Application Archive File (.war)",onClick: function(){
						    //todo 複数ある場合は判定をここでおこなう
						    that.generate(that.application, "war", "demo");
						  }}));
      this.pMenuBar.addChild(new dijit.PopupMenuBarItem({label: "Generate",popup: this.pSubMenu2}));
      var logo = document.createElement("div");
      logo.appendChild(document.createTextNode("Ajml Editor"));
      logo.style.position = "absolute";
      logo.style.right = "30px";
      logo.style.top = "4px";
      this.pMenuBar.domNode.appendChild(logo);
      this.pMenuBar.startup();
      this.mainBc = new dijit.layout.BorderContainer({"design": "sidebar","region": "center"//	"id": "mainBc",
						     });
      /**
       * ツールボックス用ペイン
       * @type dijit.TitlePane
       */
      this.toolboxCp = new dijit.TitlePane({
					     //	"splitter": "true",
					     region: "right",
					     style: {width: "200px",height: "95%"},
					     title: "toolbox",
					     toggleable: false
					   }
					  );

      this.rightBc = new dijit.layout.BorderContainer({region: "center", splitter: "true"});
      /**
       * 中央のタブコンテナ <br/>
       * 
       * @type dijit.layout.TabContainer
       */
      this.centerTc = new dijit.layout.TabContainer({region: "center", style: {height: "95%"}});
      this.rightBc.addChild(this.centerTc);
      /**
       * 画面下部のタブコンテナ
       * @type dijit.layout.TabContainer
       */
      this.bottomTc = new dijit.layout.TabContainer({region: "bottom",style: {height: "35%"}, splitter: "true"});
      /**
       * プロパティエディター部分のペイン
       * @type dijit.layout.ContentPane
       */
      this.propertyCp = new dijit.layout.ContentPane({ title: "property"});
      /**
       * ログ表示部分のペイン
       * @type dijit.layout.ContentPane
       */
      this.logCp = new dijit.layout.ContentPane({title: "log"});
      /**
       * イベントモデルエディター部分ののペイン。eventsModelプロパティに現在のアプリケーションのeventsモデルを保持する。
       * @type dijit.layout.TabContainer
       */
      this.eventTc = new dijit.layout.TabContainer({tabPosition: "left-h", title: "event"});
      
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
	  rootLabel: "COMLIST",
	  childrenAttrs: ["children"]
	}
      );
      this.toolboxTree = new dijit.Tree(
	{
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
       * プロパティエディター部分に表示されるプロパティのリストを保持するdojoストア<br/>
       * currentModelプロパティに保持しているモデルへの参照をもつ。<br/>
       * 
       * @type dojo.data.ItemFileWriteStore
       */
     this.propertyDataStore = new dojo.data.ItemFileWriteStore({identifier: "id",  data: { items: []}});
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
	      console.log(item.property);
	      if(item.property != "tagName")//タグ名は変更不可
		propertyDataStore.currentModel.properties[item.property] = item.value;
	 //     console.log("inValue:" + inValue + "   inRowIndex" + inRowIndex +
//			  "   inFiledIndex :" + inFieldIndex);
	      propertyDataStore.currentModel.updateDom();//変更されたプロパティをもとにDOMを更新
	      propertyDataStore.currentModel.updatePropertiesView();//変更不可のものをもとに戻す
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
      this.projectStore = new dojo.data.ItemFileWriteStore({data:{identifier: "modelId",label: "name",items: []}});
      this.projectTreeModel = new dijit.tree.ForestStoreModel(
	{
	  store: this.projectStore,
	  rootId: "root",
	  rootLabel: "ajweb",
	  childrenAttrs: ["children"]
	  /*query: {"type": "topNode"},*/
	});
      this.projectTree = new dijit.Tree(
	{
	  showRoot: false,
	  model: this.projectTreeModel,
	  onDblClick : function(item, node, evt){
	    if(!this.model.mayHaveChildren(item)){
	      var children = that.centerTc.getChildren();
	      var isContain = false;
	      var id = item.modelId[0];
	      for(var i = 0; i < children.length ; i++){
		if(children[i].id == id){
		  isContain = true;
		  that.centerTc.selectChild(id);
		  break;
		}
	      }
	      if(!isContain){
		var model = ajweb.getModelById(id);
		if(model){
		  model.reCreateDom();
		  model.startup();
		  that.centerTc.selectChild(id);
		}
	      }
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
       * アップロード用ダイアログ
       */
      this.uploadDialog = new dijit.Dialog(
	{
	  title: "ファイルの読み込み",
	  style: {
	    height: "200px",
	    width: "300px",
	    top: "50%",
	    left: "50%"
	  }
	});
      var uploadForm = new dijit.form.Form(	
	{
	  method: "POST",
	  action: "upload",
	  target: "result_frame",
	  encType: "multipart/form-data"
	  // style: { visibility: "hidden"}      
	});
      //uploadForm.placeAt(document.body);
      var filenameInput = document.createElement("input");
      filenameInput.setAttribute("type", "file");
      filenameInput.setAttribute("name", "fileId");
      
      var editorInput = document.createElement("input");
      editorInput.setAttribute("type", "text");
      editorInput.setAttribute("name", "editor");
      editorInput.setAttribute("value", that.name);

      
      var uploadButton = document.createElement("input");
      uploadButton.setAttribute("type", "submit");
      uploadButton.setAttribute("value", "送信");
      uploadForm.domNode.appendChild(filenameInput);
      uploadForm.domNode.appendChild(editorInput);
      uploadForm.domNode.appendChild(uploadButton);
      this.uploadDialog.domNode.appendChild(uploadForm.domNode);
      /**
       * 新規作成ダイアログ
       */
      this.newDialog = new dijit.Dialog(
	{
	  title: "新規作成",
	  style: {

	    top: "50%",
	    left: "50%"
	  }
	});

      var appName = new dijit.layout.ContentPane(
	{ content: "アプリ名"
	  //style: { position: "absolute", top: "50px", left: "50px" }
	});
      this.newDialog.domNode.appendChild(appName.domNode);
      var appNameTextbox = new dijit.form.TextBox(
	//{ style: { position: "absolute", top: "100px", left: "100px" }}
      );
      this.newDialog.domNode.appendChild(appNameTextbox.domNode);
      var createButton = new dijit.form.Button(
	{ label: "create", 
	  //style: {position: "absolute", top: "80px", left: "150px"},
	  onClick: function(){
	    that.newApplication(appNameTextbox.value);
	    that.newDialog.hide();
	  }
	});
      this.newDialog.domNode.appendChild(createButton.domNode);

//右クリックメニュー
      var pMenu;

      pMenu = new dijit.Menu({ //targetNodeIds: ["prog_menu"]
			     });
      pMenu.bindDomNode(document.body);
      pMenu.addChild(new dijit.MenuItem({label: ""}));
      pMenu.addChild(new dijit.MenuItem({label: "Disabled menu item",disabled: true }));
      pMenu.addChild(new dijit.MenuItem({
            label: "Menu Item With an icon",
            iconClass: "dijitEditorIcon dijitEditorIconCut",
					  onClick: function() {
					  }
					}));
      pMenu.addChild(new dijit.CheckedMenuItem({label: "checkable menu item"}));
      pMenu.addChild(new dijit.MenuSeparator());

      var pSubMenu = new dijit.Menu();
      pSubMenu.addChild(new dijit.MenuItem({label: "Submenu item"}));
      pSubMenu.addChild(new dijit.MenuItem({label: "Submenu item"}));
      pMenu.addChild(new dijit.PopupMenuItem({label: "Submenu",popup: pSubMenu}));
      pMenu.startup();
    },
    /**
     *新しいアプリケーションプロジェクトを作成。 
     * @param {String}  appName アプリケーション名
     */
    newApplication : function(appName){
      var application =  new ajweb.editor.model.Application(
	{
	  id: "application_" + appName,
	  tagName: "application",
	  properties: { name: appName},
	  propertyList: ["name"],
	  editor: this
	});
      this.application = application;
      this.applications.push(application);
      var interfaces = this.createModel("interfaces", {}, application);
      var databases = this.createModel("databases", {}, application, this.centerTc);
      var events = this.createModel("events", {}, application);
      this.eventTc.currentModel = events;
      var rooPanel = this.createModel("panel", {}, interfaces, this.centerTc);

      return application;
    },
    /**
     * 保存したajmlからプロジェクトを復元。
     * アップロード完了を受け取るiframから呼び出される
     * @param {String}  ajml 保存したajmlの文字列
     */
    openAjml: function(ajml){
      var xml =  ajweb.xml.parse(ajml);
      var rootElement = xml.documentElement;
      var applicationXml, appName;
      for(var i = 0; i < rootElement.childNodes.length; i++){
	var child = rootElement.childNodes[i];
	if(child instanceof Element && child.tagName == "application"){
	  applicationXml = child;
	  for(var j = 0; j < applicationXml.attributes.length; j++){
	    if(applicationXml.attributes[j].name == "name")
	      appName = applicationXml.attributes[j].value;
	  }
	}
      }
      var application =  new ajweb.editor.model.Application(
	{
	  id: "application" + appName,
	  tagName: "application",
	  properties: { name: appName},
	  propertyList: ["name"],
	  editor: this
	});
      this.application = application;
      this.applications.push(application);
      application.xmlToModel(applicationXml);
      
      return application;
    },
    /**
     * プロジェクトの一時保存
     */
    saveAjml: function(applicationModel){
      var xml = ajweb.editor.modelToSaveXml(applicationModel);
      var content = ajweb.xml.serialize(xml);
      this.sendForm(content, "ajml", applicationModel.properties.name);
    },
    /**
     * モデルから、ajmlまたは、warファイルを作成 
     */
    generate:  function(model, outputType, filename){
      var xml = ajweb.editor.modelToXml(model);
      var content = ajweb.xml.serialize(xml);
      this.sendForm(content, "war", model.properties.name);
    },
    /**
     * 文字列ajmlを送信して結果fileme.typeを受け取る
     */
    sendForm: function(ajml, type, filename){
      var generateForm = new dijit.form.Form(
	{
	  id: "generate_form",
	  method: "POST",
	  action: "generate",
	  style: { visibility: "hidden"}      
	});
      generateForm.placeAt(document.body);
      var filenameTextBox = new dijit.form.TextBox(
	{id: "filename", name: "filename", value: ""}
      );
      filenameTextBox.placeAt(generateForm.domNode);
      var outputTypeTextBox = new dijit.form.TextBox(
	{id: "type", name: "type", value: ""}
      );
      outputTypeTextBox.placeAt(generateForm.domNode);
      var ajmlTextArea = new dijit.form.Textarea(
	{id: "ajml", name: "content", value: ""}
      );
      ajmlTextArea.placeAt(generateForm.domNode);
      filenameTextBox.setValue(filename);
      ajmlTextArea.setValue(ajml);
      outputTypeTextBox.setValue(type);
      generateForm.submit();
      generateForm.destroyRecursive();
    },
    /**
     * 保存してあるファイルからプロジェクトを復元
     */
    openFile: function(){     
      var uploadIframe = document.createElement("iframe");
      uploadIframe.setAttribute("id", "result_frame");
      uploadIframe.setAttribute("name", "result_frame");
      uploadIframe.style.display = "none";
      document.body.appendChild(uploadIframe);
      this.uploadDialog.show();
    },

/**
 * モデル名からモデルの情報を参照してモデルオブジェクトを作成する。
 * @param {String} name モデル名
 * @param {Object} properties プロパティのハッシュ
 * @param {ajweb.editor.model.Model} parent 親ウィジェット
 * @param {ajweb.editor.element.ModelElement|dijit.layout.TabContainer} container 配置するDOM要素を保持するオブジェクト
 * @param {dojo.data.ItemFileReadStore} propertyDataStore 表示するプロパティを保持するdojoストア
 * @param {dijit.layout.TabContainer} eventTc イベントリストを保持するcenterTc
 */
    createModel : function(name, properties, parent, container){
      var modelInfo = ajweb.editor.getModelInfo(name);
      var elementClass = modelInfo.elementClass;
      var modelClass = modelInfo.modelClass;
      var ModelClass = modelClass.substr(0,1).toLocaleUpperCase() + modelClass.substr(1);
      var propertyList = dojo.clone(modelInfo.propertyList);
      var defaultProperties = dojo.clone(modelInfo.defaultProperties);
      
      if(properties){
	if(!properties.id)
	  properties.id = name + ajweb.editor.modelCount(name);
	propertyList.push("id");
	propertyList.push("top");
	propertyList.push("left");
	
	for(var i = 0; i < propertyList.length; i++){
	  if(properties[propertyList[i]])
	    defaultProperties[propertyList[i]] = properties[propertyList[i]];
	}
      }
      var newModel =  new ajweb.editor.model[ModelClass](
	{
	  id: properties.id,
	  tagName: name,
	  acceptModelType: modelInfo.acceptModelType,
	  elementClass: elementClass,
	  properties: defaultProperties,
	  propertyList: modelInfo.propertyList,
	  eventList: modelInfo.eventList,
	  parent: parent,
	  container: container,
	  editor: this
	}
      );
      this.addProjectTree(newModel);
      newModel.startup();
      return newModel;
    },
    /**
     * プロジェクトツリーに追加
     */
    addProjectTree: function(model){
      var that = this;
      var name = model.tagName;
      var properties = model.properties;
      if(name == "databases" || name == "panel"){
	that.projectTreeModel.getRoot(
	  function(item){
	    that.projectTreeModel.getChildren(
	      item,
	      function(items){
		for(var i = 0; i < items.length; i++){
		  if(items[i].name == that.application.properties.name){
		    that.projectTreeModel.getChildren(
		      items[i],
		      function(_items){
			for(var j = 0; j < _items.length; j++){
			  if(_items[j].modelType == "databases" && name == "databases")
			    that.projectTreeModel.newItem(
			      {name: properties.id, modelType: name, modelId: properties.id}, _items[j]
			    );
			  else if(_items[j].modelType == "interfaces" && name == "panel")
			  that.projectTreeModel.newItem(
			      {name: properties.id, modelType: name, modelId: properties.id}, _items[j]
			    );
			}
		      },
		      function(error){
		      }
		    );
		  }
		}
	      },
	      function(error){
	      }
	    );
	  });
      }
    }
  }
);
