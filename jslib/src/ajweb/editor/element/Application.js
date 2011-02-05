dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.Menuable");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.CheckBox");

dojo.provide("ajweb.editor.element.Application");
dojo.declare("ajweb.editor.element.Application",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Menuable
	     ],
  /** @lends ajweb.editor.element.Application.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {},
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var that = this;
      
      this.widget = new dijit.layout.ContentPane(
	{
	  title: this.model.properties.name,
	  closable: true,
	  doLayout: false,
	  onClose: function(){
	    that.model.removeDomDescendants();
	    that.model.properties._isDisplay = "false";
	    return true;
	  }
	});
      that.model.properties._isDisplay = "true";
      this.widget.jsId = this.model.id;

      this.appName = new dijit.layout.ContentPane({content: "appName", style: { position: "absolute", top: "50px", left: "100px"}});
      this.appNameTextbox = new dijit.form.TextBox({style:{ position: "absolute", width: "100px", top: "50px", left: "250px"},
						    value: that.model.properties.name,
						    onChange: function(value){
						      that.model.properties.name = value;
						  }});

      this.isComet = new dijit.layout.ContentPane({content: "isComet", style: { position: "absolute", top: "75px", left: "100px"}});
      this.isCometTextbox = new dijit.form.CheckBox({style:{ position: "absolute", top: "75px", left: "250px"},
						     checked: that.model.properties.isComet == "true", 
						     onChange: function(value){
						       that.model.properties.isComet = value+"";
						     }});

      this.sessionTimeout = new dijit.layout.ContentPane({content: "sessionTimeout", 
							  style: { position: "absolute", top: "100px", left: "100px"}});
      this.sessionTimeoutTextbox = new dijit.form.NumberSpinner({style:{ position: "absolute", width: "100px", top: "100px", left: "250px"},
								 constraints: {min: -9999, max: 100000},
								 value: that.model.properties.sessionTimeout,
								 onChange: function(value){
								   that.model.properties.sessionTimeout = value;
								 }});

      this.longPollingTimeout = new dijit.layout.ContentPane({content: "longPollingTimeout",
							      style: { position: "absolute", top: "125px", left: "100px"}});
      this.longPollingTimeoutTextbox = new dijit.form.NumberSpinner({style:{ position: "absolute", width: "100px", top: "125px", left: "250px"},
								     constraints: {min: 0, max: 100000},
								     value: that.model.properties.longPollingTimeout,
								     onChange: function(value){
								       that.model.properties.longPollingTimeout = value;
								     }});
      this.longPollingInterval = new dijit.layout.ContentPane({content: "longPollingInterval",
							      style: { position: "absolute", top: "150px", left: "100px"}});
      this.longPollingIntervalTextbox = new dijit.form.NumberSpinner({style:{ position: "absolute", width: "100px", top: "150px", left: "250px"},
								      constraints: {min: 0, max: 100000},
								      value: that.model.properties.longPollingInterval,
								      onChange: function(value){
									that.model.properties.longPollingInterval = value;
								      }});
      this.pollingInterval = new dijit.layout.ContentPane({content: "pollingInterval",
							   style: { position: "absolute", top: "175px", left: "100px"}});
      this.pollingIntervalTextbox = new dijit.form.NumberSpinner({style:{ position: "absolute", width: "100px", top: "175px", left: "250px"},
								  constraints: {min: 0, max: 100000},
								  value: that.model.properties.pollingInterval,
								  onChange: function(value){
								    that.model.properties.pollingInterval = value;
								  }});


      this.widget.domNode.appendChild(this.appName.domNode);
      this.widget.domNode.appendChild(this.appNameTextbox.domNode);
      this.widget.domNode.appendChild(this.isComet.domNode);
      this.widget.domNode.appendChild(this.isCometTextbox.domNode);
      this.widget.domNode.appendChild(this.sessionTimeout.domNode);
      this.widget.domNode.appendChild(this.sessionTimeoutTextbox.domNode);
      this.widget.domNode.appendChild(this.longPollingTimeout.domNode);
      this.widget.domNode.appendChild(this.longPollingTimeoutTextbox.domNode);
      this.widget.domNode.appendChild(this.longPollingInterval.domNode);
      this.widget.domNode.appendChild(this.longPollingIntervalTextbox.domNode);
      this.widget.domNode.appendChild(this.pollingInterval.domNode);
      this.widget.domNode.appendChild(this.pollingIntervalTextbox.domNode);


      return this.widget.domNode;
    },
    removeDom: function(){
      this.model.editor.centerTc.removeChild(this.widget);
      this.widget.destroyRecursive();
    },
    updateDom: function(){
      this.widget.set({title: this.model.properties.name});

      this.model.editor.updateProjectTree(this.model);
    },
    createDndDomNode: function(){
      return this.domNode;
    },
    createMoveContainerDomNode: function(){
      return this.widget.domNode;
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
      this.updateDom();
    }
  }
);