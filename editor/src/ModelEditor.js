dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.TitlePane");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.Tree");
dojo.require("dijit.tree.dndSource");
dojo.require("dojo.dnd.Source");
dojo.require("dojo.dnd.Container");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dijit.PopupMenuItem");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.xml.parser");
dojo.require("dojox.xml.DomParser");
dojo.require("ajweb.data.Database");

ajweb.editor.generate = function(output_type){
alert(output_type);
  var xml_str = '<?xml version="1.0" encoding="UTF-8"?>'
	      + '<ajml>'

	      + '</ajml>';

    var xml = dojox.xml.parser.parse(xml_str);

//  var xml = ajweb.xml.createDocument("ajml", null);
  var rootElement = xml.documentElement;
  var applicationElement = xml.createElement("application");
  rootElement.appendChild(applicationElement);


  for(var i = 0; i < ajweb.editor.editorCpList.length; i++){
    var model = ajweb.editor.editorCpList[i];
    var element = model.getXMLElement(xml);

    applicationElement.appendChild(element);
    //alert(ajweb.editor.editorCpList[i].id);
  }

  var content = ajweb.xml.serialize(xml);

//  content = '<?xml version="1.0" encoding="UTF-8"?><ajml  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"    xsi:noNamespaceSchemaLocation="./resources/schema/ajml.xsd" >  <application root="root">    <panel id="root" height="100%" width="100%">      <textbox id="yourname" content="yourname" top="30px" left="100px"/>      <button id="hello_button"  content="Hello"  top="50px">	<event id="sayhello" type="onClick">	  <action type="bind" name="bind">	    <param name="input">	      <value element="name" property="widget.innerHTML"/>	    </param>	    <param name="to"> 	      <value element="yourname" property="element.value"/>	    </param>	  </action>	</event>      </button>      <label id="hello" content="Hello" top="120px" left="100px"></label>      <label id="name" content="   " top="120px" left="140px"></label>    </panel>  </application></ajml>';
//  alert(content);
  ajweb.editor.modelEditor.ajmlFilename.setValue("hello");
  ajweb.editor.modelEditor.ajmlTextArea.setValue(content);
  ajweb.editor.modelEditor.outputType.setValue(output_type);


  ajweb.editor.form.submit();
//  ajweb.editor.form.execute();


};



dojo.declare(
  "ajweb.editor.ModelEditor", null,
  {
    constructor:
    function(name, container_id, menu_id){

      var outerBc = new dijit.layout.BorderContainer(
      {
	"id": "outerBc",
	"style": {height: "95%"}
      }, container_id);

      var pMenuBar = new dijit.MenuBar({ style: {top: "0px"}}, menu_id);
      var pSubMenu = new dijit.Menu({});
      pSubMenu.addChild(
	new dijit.MenuItem(
	  {
	  label: "UIModel",
	  onClick: function(){
	    ajweb.editor.createEditorCp("UIModel", ajweb.editor.modelEditor.projectStore);
	  }
	}
      )
    );
    pSubMenu.addChild(
      new dijit.MenuItem(
	{
	  label: "DBModel",
	  onClick: function(){
	   ajweb.editor.createEditorCp("DBModel", ajweb.editor.modelEditor.projectStore);
	  }
	}
      )
    );
/*    pSubMenu.addChild(
      new dijit.MenuItem(
	{
	  label: "EventModel",
	  onClick: function(){
	   ajweb.editor.createEditorCp("EventModel", ajweb.editor.modelEditor.projectStore);
	  }
	}
      )
    );*/
    pMenuBar.addChild(
      new dijit.PopupMenuBarItem({
				   label: "New",
				   popup: pSubMenu
				 }));
    var pSubMenu2 = new dijit.Menu({});
    pSubMenu2.addChild(
      new dijit.MenuItem(
	{
	  label: "Ajml File",
	  onClick: function(){
	    ajweb.editor.generate("ajml");
	  }
	}
      )
    );
    pSubMenu2.addChild(
      new dijit.MenuItem(
	{
	  label: "Application Archive File (.war)",
	  onClick: function(){
	    ajweb.editor.generate("war");

	  }
	}
      )
    );
    pMenuBar.addChild(
      new dijit.PopupMenuBarItem(
	{
	  label: "Generate",
	  popup: pSubMenu2

	}
      )
    );


    var logo = document.createElement("p");
    logo.appendChild(document.createTextNode("Ajml Editor"));
    logo.style.position = "absolute";
    logo.style.right = "30px";
    logo.style.top = "-15px";
    pMenuBar.domNode.appendChild(logo);
    pMenuBar.startup();

//      outerBc.placeAt(dojo.byId("ajmlEditor"));
      this.mainBc = new dijit.layout.BorderContainer(
	{
	  "id": name+"Bc",
	  "design": "sidebar",
	  "region": "center"
	});
      this.toolboxCp = new dijit.TitlePane({
					      id : name + "toolboxCp",
					     region: "right",
					     style: {width: "200px",height: "95%"},
					     title: "toolbox",
					     toggleable: false
						      //,"splitter": "true"
						    });
      this.rightBc = new dijit.layout.BorderContainer({
							"id": name+"ModelRightBc",
							"region": "center"
							,"splitter": "true"
						      });
      this.layoutContainer = new dijit.layout.TabContainer({
							     "id" : "layoutContainer",
							     "region": "center",
							     style: {
							       height: "95%"
							     }
//							,"splitter": "true"
						      });
      this.rightBc.addChild(this.layoutContainer);
      this.bottomTc = new dijit.layout.TabContainer({
					      region: "bottom",
					      style: {height: "200px"}
						      ,"splitter": "true"
					    });
      this.propertyCp = new dijit.layout.ContentPane({
//					      region: "bottom",
					      style: {height: "200px"},
					      title: "property"
						     });

      this.logCp = new dijit.layout.ContentPane({
						     id:"logCp",
//					      region: "bottom",
					      style: {height: "200px"},
					      title: "log"
						});

//      this.eventCp.addChild(this.eventTb);

      this.eventTc = new dijit.layout.TabContainer({
						     tabPosition: "left-h",
						     title: "event"
						   });

      if(outerBc)
	outerBc.addChild(this.mainBc);
      this.mainBc.addChild(this.rightBc);

      this.mainBc.addChild(this.toolboxCp);
      this.rightBc.addChild(this.bottomTc);
      this.bottomTc.addChild(this.propertyCp);
      this.bottomTc.addChild(this.eventTc);
      this.bottomTc.addChild(this.logCp);

      if(outerBc){
	outerBc.startup();
	this.mainBc.startup();
	this.rightBc.startup();
	this.toolboxCp.startup();
      }
      this.toolboxStore = new dojo.data.ItemFileWriteStore(
	{
	  data: {
	    'identifier': "name",
	    'label' : "name",
	    items: ajweb.editor.COMLIST
	  }
	});
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
//      this.toolboxTree.placeAt(this.toolboxCp.domNode);
      this.toolboxCp.wipeNode.appendChild(this.toolboxTree.domNode);
      this.toolboxTree.dndController.checkAcceptance = function(){ return false;};
      var propertyDataGridStructure =  {
	cells:  [
	  {name: "name", field: "property", width: "30%"},
	  {name: "value", field: "value", width: "auto", editable: "true"}
	]
      };

      ajweb.editor.propertyDataStore = new dojo.data.ItemFileWriteStore(
	{
	  identifier: "id",
	  data: {  items: []}
	}
      );
      this.propertyDataGrid = new dojox.grid.DataGrid(
		   {
		     store: ajweb.editor.propertyDataStore,
		     structure: propertyDataGridStructure,
		     onApplyCellEdit: function(inValue, inRowIndex, inFieldIndex)
		     {
			var _item = this.getItem(inRowIndex);
			var item = {};
			for(var i = 0; i < this.structure.cells.length; i++){
			item[this.structure.cells[i].field] = _item[this.structure.cells[i].field][0];
			}
		       ajweb.editor.currentWidget.properties[item.property] = item.value;

		       console.log("inValue:" + inValue + "   inRowIndex" + inRowIndex +
			"   inFiledIndex :" + inFieldIndex);
		       ajweb.editor.currentWidget.update();
		       // console.log(dojo.toJson(this.getItem(inRowIndex)));
		     }
		   }, dojo.doc.createElement('div'));

		 this.propertyDataGrid.placeAt(this.propertyCp.domNode);
		 //dojo.byId('gridContainer4').appendChild(myDataGrid.domNode);
		 this.propertyDataGrid.startup();


//		 this.projectExploerBc = new dijit.layout.ContentPane(
		 this.projectExploerBc = new dijit.TitlePane(
		   {
		     id : "projectExploerBc",
		     style: {width: "200px", height: "95%"},
		     region: "left",
		     toggleable: false,
		     title: "projectExploer"
		   });
		 this.projectStore = new dojo.data.ItemFileWriteStore(
		   {
//		     url: "./resources/project.json",// ここは変更可能に
		     data: {
		       identifier: "name",
		       label: "name",
		       items: []}
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
			 var modelName = item.name[0];
			 ajweb.editor.modelEditor.layoutContainer.selectChild(modelName);
		       }
		     },
		     getIconClass: function(item, opened){
		       return (!item || this.model.mayHaveChildren(item)) ?
			 (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf";
		     }
		   }
		 );
		 this.projectTree.placeAt(this.projectExploerBc.wipeNode);
     		 outerBc.addChild(this.projectExploerBc);

      this.generateForm = new dijit.form.Form(
	{
	  id: "generate_form",
	  method: "POST",
	  action: "base"
	});


      this.ajmlFilename = new dijit.form.TextBox(
	{id: "filename", name: "filename", value: "sample"}
      );
      this.ajmlFilename.placeAt(this.generateForm.domNode);

      this.outputType = new dijit.form.TextBox(
	{id: "output_type", name: "output_type", value: "ajml"}
      );

      this.outputType.placeAt(this.generateForm.domNode);

      this.ajmlTextArea = new dijit.form.Textarea(
	{id: "ajml", name: "content", value: "ajmlさんぷる"}
      );
      this.ajmlTextArea.placeAt(this.generateForm.domNode);
      outerBc.domNode.appendChild(this.generateForm.domNode);
      this.generateForm.domNode.style.visibility = "hidden";
      ajweb.editor.form = this.generateForm;


    }
  }
);

