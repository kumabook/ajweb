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
dojo.require("dojox.grid.cells.dijit");
dojo.require("ajweb.editor.gridCellEdit");


dojo.require("ajweb.base");
dojo.require("ajweb.editor.base");
dojo.require("ajweb.editor.resources");
dojo.require("ajweb.editor.model.Model");
dojo.require("ajweb.editor.model.Application");
dojo.require("ajweb.editor.model.Widget");
dojo.require("ajweb.editor.model.Eventable");
dojo.require("ajweb.editor.model.Database");
dojo.require("ajweb.editor.model.Property");
dojo.require("ajweb.editor.model.Init");
dojo.require("ajweb.editor.model.InitProperty");
dojo.require("ajweb.editor.model.Event");
dojo.require("ajweb.editor.model.Events");
dojo.require("ajweb.editor.model.Action");
dojo.require("ajweb.editor.model.Branch");
dojo.require("ajweb.editor.model.Condition");
dojo.require("ajweb.editor.model.Func");
dojo.require("ajweb.editor.model.Login");
dojo.require("ajweb.editor.model.Value");
dojo.require("ajweb.editor.model.Param");
dojo.require("ajweb.editor.model.ParamCondition");
dojo.require("ajweb.editor.model.StringSelect");
dojo.require("ajweb.editor.element.Widget");
dojo.require("ajweb.editor.element.Table");
dojo.require("ajweb.editor.element.Databases");
dojo.require("ajweb.editor.element.Database");
dojo.require("ajweb.editor.element.Init");
dojo.require("ajweb.editor.element.Item");
dojo.require("ajweb.editor.element.InitProperty");
dojo.require("ajweb.editor.element.Branch");
dojo.require("ajweb.editor.element.Then");
dojo.require("ajweb.editor.element.Condition");
dojo.require("ajweb.editor.element.Predicate");
dojo.require("ajweb.editor.element.PredicateOperator");
dojo.require("ajweb.editor.element.Panel");
dojo.require("ajweb.editor.element.Button");
dojo.require("ajweb.editor.element.Label");
dojo.require("ajweb.editor.element.Th");
dojo.require("ajweb.editor.element.Textbox");
dojo.require("ajweb.editor.element.Frame");
dojo.require("ajweb.editor.element.Value");

dojo.require("ajweb.editor.element.ElementSelect");



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
    constructor: function(name, generateURL, uploadURL){
      this.name = name;
      this.generateURL = generateURL;
      this.uploadURL = uploadURL;
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
      this.fileMenu = new dijit.Menu({});

      this.fileMenu.addChild(new dijit.MenuItem({label: ajweb.getValue("new"),
						 onClick: function(){that.newDialog.show();}}));
      this.fileMenu.addChild(new dijit.MenuItem({label: ajweb.getValue("open"),
						 onClick: function(){ that.openFile();}}));
      this.saveMenu = new dijit.Menu();
      this.fileMenu.addChild(new dijit.PopupMenuItem({label: ajweb.getValue("save"),popup: this.saveMenu}));
      this.pMenuBar.addChild(new dijit.PopupMenuBarItem({label: ajweb.getValue("file"),popup: this.fileMenu}));
      this.generateMenu = new dijit.Menu({});
      this.generateWarMenu = new dijit.Menu();
      this.generateMenu.addChild(new dijit.PopupMenuItem({label: ajweb.getValue("war"),popup: this.generateWarMenu}));
      this.pMenuBar.addChild(new dijit.PopupMenuBarItem({label: ajweb.getValue("generate") ,popup: this.generateMenu}));
      var logo = document.createElement("div");
      logo.appendChild(document.createTextNode("Ajml Editor"));
      logo.style.position = "absolute";
      logo.style.right = "30px";
      logo.style.top = "4px";
      this.pMenuBar.domNode.appendChild(logo);
      this.pMenuBar.startup();
      this.mainBc = new dijit.layout.BorderContainer({"design": "sidebar","region": "center"});
      /**
       * ツールボックス用ペイン
       * @type dijit.TitlePane
       */
      this.toolboxCp = new dijit.TitlePane({
					     region: "right",
					     style: {width: "200px", overflowY: "auto"},
					     title: ajweb.getValue("toolbox"),
					     splitter: "true",
					     toggleable: false
					   }
					  );

      this.rightBc = new dijit.layout.BorderContainer({region: "center"});
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
      this.propertyCp = new dijit.layout.ContentPane({ title: ajweb.getValue("property")});
      /**
       * ログ表示部分のペイン
       * @type dijit.layout.ContentPane
       */
      this.logCp = new dijit.layout.ContentPane({title: ajweb.getValue("log")});
      /**
       * イベントモデルエディター部分ののペイン。
       */
      this.eventCp = new dijit.layout.ContentPane({title: ajweb.getValue("event")});

      this.eventTarget = new dijit.form.Button(
	{style: {position: "absolute", top: "3px", left: "10px"},
	 label: "エレメントが選択されていません"});

      /**
       * イベントのリストを表示するタブコンテナ
       * eventsModelプロパティに現在のアプリケーションのeventsモデルを保持する。
       * @type dijit.layout.TabContainer
       */
      this.eventTc = new dijit.layout.TabContainer(
	{ style: {position: "absolute", top: "30px", left: "0px", overflowX: "scroll"},
	  tabPosition: "left-h", title: ajweb.getValue("event")});
      this.addEventMenu = new dijit.Menu();
      this.addEventButton = new dijit.form.DropDownButton(
	{ label: "イベントを追加", disabled: true,
	  dropDown: this.addEventMenu,
	  style: {position: "absolute", top: "3px",
		  left: (this.eventTarget.label.length * ajweb.editor.FONT_SIZE)
		  +ajweb.editor.ADD_EVENT_BUTTON_LEFT_NOELEMENT+"px"}}
      );

      this.eventTc.placeAt(this.eventCp.domNode);
      this.addEventButton.placeAt(this.eventCp.domNode);
      this.eventCp.domNode.appendChild(this.eventTarget.domNode);


      this.outerBc.addChild(this.mainBc);
      this.mainBc.addChild(this.rightBc);
      this.mainBc.addChild(this.toolboxCp);
      this.rightBc.addChild(this.bottomTc);
      this.bottomTc.addChild(this.propertyCp);
      this.bottomTc.addChild(this.eventCp);
      this.bottomTc.addChild(this.logCp);

      this.bottomTc.selectChild(this.logCp);
      this.bottomTc.selectChild(this.propertyCp);
      this.bottomTc.selectChild(this.eventCp);


      this.outerBc.startup();
      this.mainBc.startup();
      this.rightBc.startup();
      this.toolboxCp.startup();

      this.eventTc.startup();

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

      /**
       * プロパティエディター部分に表示されるプロパティのリストを保持するdojoストア<br/>
       * currentModelプロパティに保持しているモデルへの参照をもつ。<br/>
       *
       * @type dojo.data.ItemFileWriteStore
       */
     this.propertyDataStore = new dojo.data.ItemFileWriteStore({identifier: "properties",  data: { items: []}});
      var propertyDataGridStructure =  {
	cells:  [{name: "name", field: "property", width: "30%"},
		 {name: "value", field: "value", width: "auto", editable: "true",
		  store: this.propertyDataStore,
		  type: ajweb.editor.gridCellEdit
		 }]};
      var propertyDataStore = this.propertyDataStore;
      this.propertyDataGrid = new dojox.grid.DataGrid(
	{
	  store: this.propertyDataStore,
	  structure: propertyDataGridStructure,
	  singleClickEdit: true,
	  canSort: function(){return false;},
	  onApplyCellEdit: function(inValue, inRowIndex, inFieldIndex)
	    {
//	      console.log("inValue:"+inValue+" inRowIndex"+inRowIndex+" inFiledIndex :"+inFieldIndex);
	      var _item = this.getItem(inRowIndex);
	      var item = {};
	      for(var i = 0; i < this.structure.cells.length; i++){
		item[this.structure.cells[i].field] = _item[this.structure.cells[i].field][0];
	      }
	      var model = propertyDataStore.currentModel;
	      if(item.property != "tagName"){//タグ名は変更不可
		model.properties[item.property] = item.value;
		model.application.updateRefProperty(model);
	      }
	      model.updateDom();//変更されたプロパティをもとにDOMを更新
	      model.updatePropertiesView();//変更不可のものをもとに戻す
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
	  style: {width: "200px", overflowY: "auto"/*, overflow: "auto"*/},
	  region: "left",
	  toggleable: false,
	  splitter: "true",
	  title: ajweb.getValue("projectExploer")
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
	  childrenAttrs: ["children"]/*query: {"type": "topNode"},*/
	});
      this.projectTree = new dijit.Tree(
	{
	  showRoot: false,
	  model: this.projectTreeModel,
	  onDblClick : function(item, node, evt){
	    var children = that.centerTc.getChildren();
	    var id = item.modelId;
	    for(var i = 0; i < children.length ; i++){
	      if(children[i].modelId == id){
		that.centerTc.selectChild(children[i]);
		return;
	      }
	    }
	    var model = ajweb.getModelById(id);
	    if(model.element)
	      if(model.element.container == that.centerTc){
		model.reCreateDom(that.centerTc);
		model.startup();
		that.centerTc.selectChild(model.element.widget);
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
       *
       */

      /**
       * アップロード用ダイアログ
       */
      this.uploadDialog = new dijit.Dialog(
	{
	  title: ajweb.getValue("loadFile")});
      var uploadForm = new dijit.form.Form(
	{
	  method: "POST",
	  action: this.uploadURL,
	  target: "result_frame",
	  encType: "multipart/form-data"
	});

      var filenameInput = document.createElement("input");
      filenameInput.setAttribute("type", "file");
      filenameInput.setAttribute("name", "fileId");

      var editorInput = document.createElement("input");
      editorInput.setAttribute("type", "text");
      editorInput.setAttribute("name", "editor");
      editorInput.setAttribute("value", that.name);
      editorInput.style.display = "none";

      var uploadButton = document.createElement("input");
      uploadButton.setAttribute("type", "submit");
      uploadButton.setAttribute("value", ajweb.getValue("load"));
      uploadForm.domNode.appendChild(filenameInput);
      uploadForm.domNode.appendChild(editorInput);
      uploadForm.domNode.appendChild(uploadButton);
      this.uploadDialog.setContent(uploadForm.domNode);
      /**
       * 新規作成ダイアログ
       */
      this.newDialog = new dijit.Dialog({ title: ajweb.getValue("newApplication")});
      var appName = new dijit.layout.ContentPane({ content: "アプリ名"});
      var appNameTextbox = new dijit.form.TextBox();
      appName.domNode.appendChild(appNameTextbox.domNode);
      var createButton = new dijit.form.Button(
	{ label: ajweb.getValue("create"),
	  onClick: function(){
	    that.newApplication(appNameTextbox.value);
	    that.newDialog.hide();
	  }
	});
      appName.domNode.appendChild(createButton.domNode);
      this.newDialog.setContent(appName.domNode);
      /**
       * 右クリックメニュー　
       * todo 使いやすいようにショートカットを
       *
       */
      this.contextMenu = new dijit.Menu(
	{
	  onOpen: function(){
	    var node =  that.projectTree.lastFocused.domNode.childNodes[0].childNodes[2].childNodes[2].innerHTML;
	    if(!node) return;
	    for(var i = 0; i < that.applications.length; i++){//applicationの場合
	      if(node == that.applications[i].properties.name){
		var application = that.applications[i];
		this.appSaveMenu = new dijit.MenuItem(
		  {label: "save", onClick: function(){that.saveAjml(application);}});
		this.addChild(this.appSaveMenu);
		this.appGenerateMenu = new dijit.MenuItem(
		  {label: "generateWar", onClick: function(){that.generate(application);}});
		this.addChild(this.appGenerateMenu);
	      }
	    }
	  },
	  onClose: function(){
	    if(this.appGenerateMenu){
	      this.appSaveMenu.destroy();
	      this.appGenerateMenu.destroy();
	    }
	  }
	});
      this.contextMenu.bindDomNode(this.projectTree.domNode);
      this.contextMenu.addChild(new dijit.MenuItem({label: "右クリックメニュー" }));

    },
    /**
     *新しいアプリケーションプロジェクトを作成。
     * @param {String}  appName アプリケーション名
     */
    newApplication : function(appName){
      var that = this;
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
      var interfaces = this.newModel("interfaces", {}, application);
      var databases = this.newModel("databases", {}, application, this.centerTc);
      var events = this.newModel("events", {}, application);
      this.eventTc.currentModel = events;
      var rootPanel = this.newModel("panel", {id: "rootPanel"}, interfaces, this.centerTc);
      //メニューに追加
      var appSaveMenu = new dijit.MenuItem(
	{
	  label: appName,
	  onClick: function(){
	    that.saveAjml(application);
	  }
	});
      that.saveMenu.addChild(appSaveMenu);
      var appGenerateMenu = new dijit.MenuItem(
	{
	  label: appName,
	  onClick: function(){
	    that.generate(application);
	  }
	});
      that.generateWarMenu.addChild(appGenerateMenu);
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
      var applicationNode, appName;
      for(var i = 0; i < rootElement.childNodes.length; i++){
	var child = rootElement.childNodes[i];
	if(child instanceof Element && child.tagName == "application"){
	  applicationNode = child;
	  for(var j = 0; j < applicationNode.attributes.length; j++){
	    if(applicationNode.attributes[j].name == "name")
	      appName = applicationNode.attributes[j].value;
	  }
	}
      }
      var application =  new ajweb.editor.model.Application(
	{
	  id: "application_" + ajweb.editor.modelCount("application"),
	  tagName: "application",
	  properties: { name: appName},
	  propertyList: ["name"],
	  editor: this
	});
      this.application = application;
      this.applications.push(application);
//      var events = this.newModel("events", {}, application);
      application.xmlToModel(applicationNode, xml);

      var that = this;

      //メニューに追加
      var appSaveMenu = new dijit.MenuItem(
	{
	  label: appName,
	  onClick: function(){
	    that.saveAjml(application);
	  }
	});
      that.saveMenu.addChild(appSaveMenu);
      var appGenerateMenu = new dijit.MenuItem(
	{
	  label: appName,
	  onClick: function(){
	    that.generate(application);
	  }
	});
      that.generateWarMenu.addChild(appGenerateMenu);


      return application;
    },
    /**
     * アプリケーションをajmlとして一時保存
     * @param {ajweb.editor.model.Application} applicationModel 保存するアプリケーションのモデル
     */
    saveAjml: function(applicationModel){
      var xml = ajweb.xml.createDocument("ajml");
      var rootElement = xml.documentElement;
      var applicationElement = applicationModel.toXMLElement(true);
      rootElement.appendChild(applicationElement);
      var content = ajweb.xml.serialize(xml);
      this.sendForm(content, "ajml", applicationModel.properties.name);
    },
    /**
     * モデルから、warファイルを作成
     * @param {ajweb.editor.model.Application} applicationModel 保存するアプリケーションのモデル
     */
    generate:  function(applicationModel){
      var xml = ajweb.xml.createDocument("ajml");
      var rootElement = xml.documentElement;
      var applicationElement = applicationModel.toXMLElement(xml);
      rootElement.appendChild(applicationElement);
      var content = ajweb.xml.serialize(xml);
      this.sendForm(content, "war", applicationModel.properties.name);
    },
    /**
     * 文字列ajmlを送信して結果fileme.typeを受け取る
     */
    sendForm: function(ajml, type, filename){
      var generateForm = new dijit.form.Form(
	{
	  id: "generate_form",
	  method: "POST",
	  action: this.generateURL,
	  style: { visibility: "hidden"}
	});
      generateForm.placeAt(document.body);
      var filenameTextBox = new dijit.form.TextBox({id: "filename", name: "filename", value: ""});
      filenameTextBox.placeAt(generateForm.domNode);
      var outputTypeTextBox = new dijit.form.TextBox({id: "type", name: "type", value: ""});
      outputTypeTextBox.placeAt(generateForm.domNode);
      var ajmlTextArea = new dijit.form.Textarea({id: "ajml", name: "content", value: ""});
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
 * @param {ajweb.editro.model.Model} parent 親ウィジェット
 * @param {ajweb.editor.element.ModelElement|dijit.layout.TabContainer} container 配置するDOM要素を保持するオブジェクト
 * @param {dojo.data.ItemFileReadStore} propertyDataStore 表示するプロパティを保持するdojoストア
 * @param {dijit.layout.TabContainer} eventTc イベントリストを保持するcenterTc
 */
    createModel : function(name, properties, parent, container, display){
      var modelInfo = ajweb.editor.getModelInfo(name);
      var elementClass = modelInfo.elementClass;
      var modelClass = modelInfo.modelClass;
      var ModelClass = modelClass.substr(0,1).toLocaleUpperCase() + modelClass.substr(1);
      var propertyList = dojo.clone(modelInfo.propertyList);
      var defaultProperties = dojo.clone(modelInfo.defaultProperties ? modelInfo.defaultProperties : {});
      var id = name + ajweb.editor.modelCount(name);

      propertyList.push("_character");

      if(properties){
	if(!properties.id)
	  properties.id = id;
	propertyList.push("id");
	propertyList.push("top");
	propertyList.push("left");
	for(var i = 0; i < propertyList.length; i++){
	  var propertyName = typeof propertyList[i] == "string"
	    ? propertyList[i] : propertyList[i].name;
	  if(properties[propertyName])
	    defaultProperties[propertyName] = properties[propertyName];
	}
      }

      var newModel =  new ajweb.editor.model[ModelClass](
	{
	  id: id,
	  tagName: name,
	  acceptModelType: modelInfo.acceptModelType,
	  elementClass: elementClass,
	  properties: defaultProperties,
	  propertyList: modelInfo.propertyList,
	  eventList: modelInfo.eventList,
	  parent: parent,
	  application: parent.application,
	  container: container,
	  editor: this
	}, display);

/*      if(ModelClass == "Widget" || ModelClass == "Database"){
	parent.application[ModelClass + "Store"].newItem({modelId: id, name: defaultProperties.id});
      }*/


      if(name == "events")
	parent.application.events = newModel;
      newModel.label = modelInfo.label ? modelInfo.label : newModel.properties.id;
      this.addProjectTree(newModel);
      newModel.startup();
      return newModel;
    },
    newModel: function(name, properties, parent, container){
      var model = this.createModel(name, properties, parent, container);
      model.setRefProperty();
      if(model instanceof ajweb.editor.model.Eventable){
//	model.createEventModel();
      }
      return model;
    },
    /**
     * プロジェクトツリーに追加
     */
    addProjectTree: function(model){
      var that = this;
      var addTreeModel = function(model, item, treeModel){
      treeModel.getChildren(item,
	function(items){
	  for(var i = 0; i < items.length; i++){
	    if(items[i].modelId == model.parent.id){
	      treeModel.newItem({name: model.label, modelType: model.tagName, modelId: model.id}, items[i]);
	      return;
	    }
	    addTreeModel(model, items[i], treeModel);
	  }
	});
      };
      this.projectTreeModel.getRoot(
	function(item){
	  addTreeModel(model, item, that.projectTreeModel);
	}
      );
    },
    updateProjectTree: function(model){
           var store = this.projectStore;
      this.projectStore.fetchItemByIdentity({identity: model.id, onItem: function(item){
					       store.setValue(item, "name", model.label);
					     }});
    },
    removeProjectTree: function(model){
      var store = this.projectStore;
      this.projectStore.fetchItemByIdentity({identity: model.id, onItem: function(item){
					       store.deleteItem(item);
					     }});
    }
  }
);
