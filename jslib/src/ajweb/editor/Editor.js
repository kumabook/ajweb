dojo.provide("ajweb.editor.Editor");

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

dojo.require("ajweb.editor.gridCellEdit");


dojo.require("ajweb.base");
dojo.require("ajweb.editor.base");
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
dojo.require("ajweb.editor.element.Application");
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
dojo.require("ajweb.editor.element.Text");
dojo.require("ajweb.editor.element.Th");
dojo.require("ajweb.editor.element.Textbox");
dojo.require("ajweb.editor.element.Textarea");
dojo.require("ajweb.editor.element.Frame");
dojo.require("ajweb.editor.element.Value");
dojo.require("ajweb.editor.element.String");
dojo.require("ajweb.editor.element.Int");
dojo.require("ajweb.editor.element.Date");
dojo.require("ajweb.editor.element.Time");
dojo.require("ajweb.editor.element.Datetime");

dojo.require("ajweb.editor.element.ElementSelect");

dojo.require("ajweb.editor.modelList");

dojo.require("ajweb.editor.extension.Calendar");
dojo.require("ajweb.editor.extension.DateTextbox");
dojo.require("ajweb.editor.extension.TimeTextbox");

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

      ajweb.editor.initResource();//初期化処理

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

      this.fileMenu.addChild(new dijit.MenuItem({label: ajweb.resources["new"],
						 onClick: function(){that.newDialog.show();}}));
      this.fileMenu.addChild(new dijit.MenuItem({label: ajweb.resources.open,
						 onClick: function(){ that.openFile();}}));
      this.saveMenu = new dijit.Menu();
      this.downloadMenu = new dijit.Menu();
      this.fileMenu.addChild(new dijit.PopupMenuItem({label: ajweb.resources.save, popup: this.saveMenu}));
      this.fileMenu.addChild(new dijit.PopupMenuItem({label: ajweb.resources.download, popup: this.downloadMenu}));
      this.pMenuBar.addChild(new dijit.PopupMenuBarItem({label: ajweb.resources.file, popup: this.fileMenu}));
      this.generateMenu = new dijit.Menu({});
      this.generateWarMenu = new dijit.Menu();
      this.generateMenu.addChild(new dijit.PopupMenuItem({label: ajweb.resources.war, popup: this.generateWarMenu}));
      this.pMenuBar.addChild(new dijit.PopupMenuBarItem({label: ajweb.resources.generate ,popup: this.generateMenu}));
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
					     title: ajweb.resources.toolbox,
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
      this.propertyCp = new dijit.layout.ContentPane({ title: ajweb.resources.property});
      /**
       * ログ表示部分のペイン
       * @type dijit.layout.ContentPane
       */
      this.logCp = new dijit.layout.ContentPane({title: ajweb.resources.log});
      /**
       * イベントモデルエディター部分ののペイン。
       */
      this.eventCp = new dijit.layout.ContentPane({title: ajweb.resources.event});

      this.eventTarget = new dijit.form.Button(
	{style: {position: "absolute", top: "3px", left: "10px"},
	 label: ajweb.resources.noElement});

      /**
       * イベントのリストを表示するタブコンテナ
       * eventsModelプロパティに現在のアプリケーションのeventsモデルを保持する。
       * @type dijit.layout.TabContainer
       */
      this.eventTc = new dijit.layout.TabContainer(
	{ style: {position: "absolute", top: "30px", left: "0px", overflowX: "scroll"},
	  tabPosition: "left-h", title: ajweb.resources.event});
      this.addEventMenu = new dijit.Menu();
      this.addEventButton = new dijit.form.DropDownButton(
	{ label: ajweb.resources.addEvent, disabled: true,
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
	    identifier: "id",
	    label : "name",
	    items: ajweb.editor.toolboxItems
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
	  //todo アイコンをそれっぽいのに
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
	      var i;
	      for(i = 0; i < this.structure.cells.length; i++){
		item[this.structure.cells[i].field] = _item[this.structure.cells[i].field][0];
	      }
	      var model = propertyDataStore.currentModel;
	      model.properties[item.property] = inValue;//item.value;
	      model.update();
	      if(item.property == "id"){//eventTargetラベルを更新
		that.eventTarget.set({label: inValue});
	      }
	    }
	  /*,
	  onSelected:  function(inRowIndex){
	    alert(that.propertyDataGrid.selection.getSelected());
	  }*/
	}, dojo.doc.createElement('div'));

      this.propertyDataGrid.placeAt(this.propertyCp.domNode);
      this.propertyDataGrid.startup();


     this.logDataStore = new dojo.data.ItemFileWriteStore({identifier: "message",  data: { items: []}});
      var logDataGridStructure =  {
	cells:  [{name: "app", field: "app", width: "100px"},
		 {name: "path", field: "path", width: "200px"},
		 {name: "message", field: "message", width: "auto"}]};
      var logStore = this.logDataStore;
      this.logDataGrid = new dojox.grid.DataGrid(
	{
	  store: this.logDataStore,
	  structure: logDataGridStructure
	}, dojo.doc.createElement('div'));

      this.logDataGrid.placeAt(this.logCp.domNode);
      this.logDataGrid.startup();

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
	  title: ajweb.resources.projectExploer
	}
      );
      /**
       * プロジェクトエクスプローラー用のリストをのdojoストア
       * @type dojo.data.ItemFileWriteStore
       */
      this.projectStore = new dojo.data.ItemFileWriteStore({data:{identifier: "jsId" ,label: "name",items: []}});
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
	  onDblClick : function(item, node, evt){ that.openModel(item);},/*function(item, node, evt){
	  },*/
	getIconClass: function(item, opened){//todo アイコンをそれっぽいのに
//console.log()
//	  return (!item || this.model.mayHaveChildren(item)) ?
	  return (!item || (item.modelType && (
			      that.projectStore.getValue(item, "modelType") == "frame" ||
				that.projectStore.getValue(item, "modelType") == "application" ||
				that.projectStore.getValue(item, "modelType") == "interfaces"
			    )
			   )
		 ) ?
	  
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
	  title: ajweb.resources.loadFile});
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
      uploadButton.setAttribute("value", ajweb.resources.load);
      uploadForm.domNode.appendChild(filenameInput);
      uploadForm.domNode.appendChild(editorInput);
      uploadForm.domNode.appendChild(uploadButton);
      this.uploadDialog.setContent(uploadForm.domNode);
      /**
       * 新規作成ダイアログ
       */
      this.newDialog = new dijit.Dialog({ title: ajweb.resources.newApplication});
      var appName = new dijit.layout.ContentPane({ content: ajweb.resources.appName});
      var appNameTextbox = new dijit.form.TextBox();
      appName.domNode.appendChild(appNameTextbox.domNode);
      var createButton = new dijit.form.Button(
	{ label: ajweb.resources.create,
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


	    var item = that.projectTree.lastFocused.item;
	    var model = that.projectStore.getValue(item, "model");

	    if(!model)
	      return;

	    var titleMenuItemTitle = new dijit.MenuItem({label: ajweb.resources.contextMenu + "(" +model.getProjLabel()+ ")", disabled: true});
	    that.contextMenuItems.push(titleMenuItemTitle);
	    that.contextMenu.addChild(titleMenuItemTitle);

	    if(model.tagName == "application"){
	      var appSaveMenuItem = new dijit.MenuItem(
		{label: "save", onClick: function(){that.saveProject(model);}});
	      that.contextMenuItems.push(appSaveMenuItem);
	      this.addChild(appSaveMenuItem);
	      var generateMenuItem = new dijit.MenuItem(
		{label: "generateWar", onClick: function(){that.generate(model);}});	      
	      that.contextMenuItems.push(generateMenuItem);
	      this.addChild(generateMenuItem);
	    }
	    else if(model.tagName == "panel" || model.tagName == "databases"){
	      var openMenuItem = new dijit.MenuItem(
		{label: "open", onClick: function(){that.openModel(item);}});
	      that.contextMenuItems.push(openMenuItem);
	      this.addChild(openMenuItem);

	      var refreshMenuItem = new dijit.MenuItem(
		{label: "refresh", onClick: function(){model.refreshDom();}});
	      that.contextMenuItems.push(refreshMenuItem);
	      this.addChild(refreshMenuItem);
	    }
	    var deleteMenuItem = new dijit.MenuItem(
	      {label: "delete", onClick: function(){model.remove();}});
	    that.contextMenuItems.push(deleteMenuItem);
	    this.addChild(deleteMenuItem);
	  },
	  onClose: function(){
	    for(var i = 0; i < that.contextMenuItems.length; i++){
	      that.contextMenuItems[i].destroy();
	    }
	  }
	});
      this.contextMenuItems = [];
      this.contextMenu.bindDomNode(this.projectTree.domNode);
      ajweb.editor.isPreventUnload = true;
      window.onbeforeunload = function(event){
	event = event || window.event;

	if(ajweb.editor.isPreventUnload){
	 return event.returnValue = "プロジェクトはまだ保存されていません";
	}
      }
    },

    /**
     *新しいアプリケーションプロジェクトを作成。
     * @param {String}  appName アプリケーション名
     */
    newApplication : function(appName){
      var that = this;
      var application = this.newModel("application", {name: appName}, null);

      this.application = application;
      this.applications.push(application);

      var interfaces = this.newModel("interfaces", {}, application);
      var databases = this.newModel("databases", {}, application, this.centerTc);
      var events = this.newModel("events", {}, application);
      this.eventTc.currentModel = events;
      var rootPanel = this.newModel("panel", {id: "rootPanel"}, interfaces);
      //メニューに追加
      var appSaveMenu = new dijit.MenuItem(
	{
	  label: appName,
	  onClick: function(){
	    that.saveProject(application);
	  }
	});
      that.saveMenu.addChild(appSaveMenu);
      var appDownloadMenu = new dijit.MenuItem(
	{
	  label: appName,
	  onClick: function(){
	    that.downloadAjml(application);
	  }
	});
      that.downloadMenu.addChild(appDownloadMenu);
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
      var applicationNode, properties = {};

      for(var i = 0; i < rootElement.childNodes.length; i++){
	var child = rootElement.childNodes[i];
	if((child.tagName != undefined /*|| child instanceof Element*/) && child.tagName == "application"){
	  applicationNode = child;
	  for(var j = 0; j < applicationNode.attributes.length; j++){
	      properties[applicationNode.attributes[j].name] = applicationNode.attributes[j].value;
	  }
	}
      }
      var appName = properties.name;
      var application = this.createModel("application", properties, null);

      this.application = application;
      this.applications.push(application);
      application.xmlToModel(applicationNode, xml);

      var that = this;

      //メニューに追加
      var appSaveMenu = new dijit.MenuItem(
	{
	  label: appName,
	  onClick: function(){
	    that.saveProject(application);
	  }
	});
      that.saveMenu.addChild(appSaveMenu);
      var appDownloadMenu = new dijit.MenuItem(
	{
	  label: appName,
	  onClick: function(){
	    that.downloadAjml(application);
	  }
	});
      that.downloadMenu.addChild(appDownloadMenu);
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
    saveProject: function(applicationModel){      
      ajweb.editor.isPreventUnload = null;
      var xml = ajweb.xml.createDocument("ajml");
      var rootElement = xml.documentElement;
      var applicationElement = applicationModel.toXMLElement(true);
      rootElement.appendChild(applicationElement);
      var content = ajweb.xml.serialize(xml);
      this.sendForm(content, "ajml", applicationModel.properties.name, 1000);
    },
    downloadAjml: function(applicationModel){
      ajweb.editor.isPreventUnload = null;
      var xml = ajweb.xml.createDocument("ajml");
      var rootElement = xml.documentElement;
      var applicationElement = applicationModel.toXMLElement(false);
      rootElement.appendChild(applicationElement);
      var content = ajweb.xml.serialize(xml);
      this.sendForm(content, "ajml", applicationModel.properties.name, 1000);
    },
    /**
     * モデルから、warファイルを作成
     * @param {ajweb.editor.model.Application} applicationModel 保存するアプリケーションのモデル
     */
    generate:  function(applicationModel){
      ajweb.editor.isPreventUnload = null;
      if(!applicationModel.validate()){
	alert("Error! please confirm log message.");
	return;
      }
      var xml = ajweb.xml.createDocument("ajml");
      var rootElement = xml.documentElement;
      var applicationElement = applicationModel.toXMLElement(false);
      rootElement.appendChild(applicationElement);
      var content = ajweb.xml.serialize(xml);
      this.sendForm(content, "war", applicationModel.properties.name, 10000);
    },
    /**
     * 文字列ajmlを送信して結果fileme.typeを受け取る
     */
    sendForm: function(ajml, type, filename, prevent_time){
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
      window.setTimeout(function(){//webKitだとスタックに積まないとフォームの送信より先にこっちが実行されちゃう
			  ajweb.editor.isPreventUnload = true;
			}, prevent_time);
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
    createModel : function(name, properties, parent, container){
      var modelInfo = ajweb.editor.getModelInfo(name);
      var elementClass = modelInfo.elementClass;
      var modelClass = modelInfo.modelClass;
      var ModelClass = modelClass.substr(0,1).toLocaleUpperCase() + modelClass.substr(1);
      var propertyList = dojo.clone(modelInfo.propertyList);
      var defaultProperties = dojo.clone(modelInfo.defaultProperties ? modelInfo.defaultProperties : {});
      var id = name + ajweb.editor.modelCount(name);
      var container = container ? container : 
	    modelInfo.container == "layout" ? this.centerTc :
	    parent ? parent.element : null;
      propertyList.push("_character");

	if(properties){
	if(!properties.id && !defaultProperties.id)
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
      var label = ajweb.locale == "" || ajweb.locale == "en" ? "label" : "label_"+ajweb.locale;
      var newModel =  new ajweb.editor.model[ModelClass](
	{
	  id: id,
	  tagName: name,
	  acceptModelType: modelInfo.acceptModelType,
	  elementClass: elementClass,
	  properties: defaultProperties,
	  propertyList: modelInfo.propertyList,
	  eventList: modelInfo.eventList,
	  label: modelInfo[label],
	  parent: parent,
	  application: parent ? parent.application : null,
	  container: container,
	  editor: this
	});
      
      if(name == "application"  || name == "interfaces" || name == "panel" || name == "databases" || name == "frame"){
	this.addProjectTree(newModel);
      }
	
      newModel.startup();
      return newModel;
    },
    newModel: function(name, properties, parent, container){
      var model = this.createModel(name, properties, parent, container);
      model.setRefProperty();//プロパティが実際に挿入されるときに呼び出さないと意味がないので
      if(model.createDom){
	model.createDom();
	model.startup();	
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
	    if(items[i].jsId == model.parent.id){
	      treeModel.newItem({name: model.getProjLabel(), id: model.properties.id,
				 model: model,
				 jsId: model.id, modelType: model.tagName},
				items[i]);
	      return;
	    }
	    addTreeModel(model, items[i], treeModel);
	  }
	});
      };

      this.projectTreeModel.getRoot(
	function(item){
	  if(model.parent){
	    addTreeModel(model, item, that.projectTreeModel);
	  }
	  else {//applicationモデル
	    that.projectTreeModel.newItem({name: model.getProjLabel(), id: model.properties.id,
					   model: model,
					   jsId: model.id, modelType: model.tagName},item);
	  }
	}
      );
    },
    updateProjectTree: function(model){
      var store = this.projectStore;
//      console.log("updateProjectTree");
      store.fetchItemByIdentity({identity: model.id, onItem: function(item){
	//			   console.log(model.getProjLabel());
					       store.setValue(item, "name", model.getProjLabel());
					     }});
    },
    removeProjectTree: function(model){
      var store = this.projectStore;
      this.projectStore.fetchItemByIdentity(
	{identity: model.id, onItem: function(item){
	   if(item)
	     store.deleteItem(item);
      }});

    },
    getApplicationByName: function(name){
      for(var i = 0; i < this.applications.length; i++){//applicationの場合
	if(name == this.applications[i].properties.name){
	  return this.applications[i];
	}
      }
      return null;
    },
    openModel: function(item){
      var children = this.centerTc.getChildren();
      var id = this.projectStore.getValue(item, "jsId");
      for(var i = 0; i < children.length ; i++){
	if(children[i].jsId == id){
	  this.centerTc.selectChild(children[i]);
	  return;
	}
      }
      var model = ajweb.getModelById(id);
      
      if(model.container == this.centerTc){
	model.createDomRecursive(this.centerTc);
	model.startup();
	this.centerTc.selectChild(model.element.widget);
      }
    }
  }
);
