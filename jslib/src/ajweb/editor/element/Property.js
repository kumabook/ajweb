dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("dijit.layout.ContentPane");

dojo.require("ajweb.editor.element.Element");

dojo.provide("ajweb.editor.element.Property");
dojo.declare("ajweb.editor.element.Property",
	     [ajweb.editor.element.Element,
	      ajweb.editor.element.Removable
	      ],
  /** @lends ajweb.editor.element.Property.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {boolean} opt.resizable サイズが変更可能か
     * @param {boolean} opt.movable 位置が変更可能か
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {
      this.model.properties.dbName = "jdbc:derby:work/sqlite/" + this.model.application.properties.name;
    },
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var that = this;
      this.widget = new dijit.layout.ContentPane(
	{
	  style: {
	    position : "absolute",
	    width: parseInt(this.container.domNode.style.width) - 15 + "px",
	    height: "30px",
	    top: ((this.container.domNode.childNodes.length-1) * 30) + "px",
	    left: "10px"
	  }
	});
      var disabled = false;
      if(this.model.parent.properties.tablename == "users" && 
	 (this.model.properties.name == "user_id" || this.model.properties.name == "password"))
	disabled = true;
      
      if(disabled){
	this.propName = new dijit.layout.ContentPane(
	{ name: this.id + "propName", content: properties.name,
	  style: {
	    position : "absolute",
	    width: ajweb.editor.DATABASE_PROPNAME_WIDTH+"px",
	    top: "4px",
	    left: "3px"
	  }
	});
      }
      else {
	this.propName = new dijit.form.TextBox(
	  {
	    name: this.id + "propName", disabled: disabled,
	    value: properties.name /* no or empty value! */,
	    style: {
	      position : "absolute",
	      width: ajweb.editor.DATABASE_PROPNAME_WIDTH+"px",
	      top: "4px",
	      left: "0px"
	    },
	    onChange: function(){
	      that.model.properties.name = this.value;
	    }
	  });
      }
      
      var value = that.model.properties.type ? that.model.properties.type : "int";
      if(value == "ref"){
	value = that.model.application.getElementByPropId(that.model.properties.ref).id;
      }
	

      this.select = new dijit.form.Select(
	{
	  value: value,  disabled: disabled,
	  store: this.model.application.getDataTypeStore(), sortByLabel: false,
	  style: {position : "absolute",top: "0px", left: ajweb.editor.DATABASE_PROPNAME_WIDTH+10+"px"},
	  onChange: function(value){
	    this.store.fetchItemByIdentity(
	      {identity: this.value,
	       onItem: function(item){
		 if(item.database){
		   that.model.properties.type = "ref";
		   that.model.properties.multiplicity = "1";
		   that.model.properties.ref = that.select.store.getValue(item, "database").properties.id;
		   that.model.setRefProperty();
		 }
		 else {
		   that.model.properties.type = that.select.store.getValue(item, "name");
		   that.model.properties.multiplicity = null;
		   that.model.properties.ref = null;
		   that.model.setRefProperty();
		 }
	       }});
	  }
	});

 

      this.isUnique =  new dijit.form.ToggleButton(
	{
          showLabel: true, disabled: disabled, 
	  label: this.model.properties.unique == "true" ? "uniq" : "ununiq",
	  style: {position : "absolute",top: "0px", right: ajweb.editor.REMOVE_ICON_SIZE+"px"},
          onChange: function(val) {
	    that.model.properties.unique = val.toString();
	    if(val)
              this.attr('label', "uniq");	      
            else
	      this.attr('label', "ununiq");
	  }
        });

      this.widget.domNode.appendChild(this.propName.domNode);
      this.widget.domNode.appendChild(this.select.domNode);
//      this.widget.domNode.appendChild(this.isUnique.domNode);
      this.container.domNode.style.height = (this.model.parent.children.length) * ajweb.editor.DATABASE_PROP_HEIGHT + 35 + "px";

      return this.widget.domNode;
    },
    removeDom: function(){
      this.widget.destroyRecursive();
      this.model.parent.updateDom();
    },

    updateDom: function(){
      for(var i = 0; i < this.model.parent.children.length; i++){
	if(this.model == this.model.parent.children[i]){
	  this.widget.domNode.style.top = (i+1) * 30 + "px";
	}
      }
      
      this.model.parent.refreshDom();
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
      this.select.startup();
      this.isUnique.startup();
      this.propName.startup();
    }
  }
);


