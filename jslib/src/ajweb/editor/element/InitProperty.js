dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.TimeTextBox");
dojo.require("dijit.form.NumberSpinner");

dojo.require("dijit.layout.ContentPane");
dojo.require("ajweb.date");

dojo.require("ajweb.editor.element.Element");
dojo.provide("ajweb.editor.element.InitProperty");
dojo.declare("ajweb.editor.element.InitProperty",
	     [ajweb.editor.element.Element],
  /** @lends ajweb.editor.element.InitProperty.prototype */
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
    {},
    /**
     * DOM要素を作成し、this.domNodeにDOMノードを設定する。
     */
    createDom: function(properties){
      var that = this;
      this.widget = new dijit.layout.ContentPane(
	{style: {position: "absolute", height:ajweb.editor.PARAM_WIDTH+"px", width: "400px", 
		 top:  (this.container.containerNode.childNodes.length * ajweb.editor.PARAM_WIDTH) + "px"}
	});
      this.nameLabel = new dijit.layout.ContentPane(
	{style: {position: "absolute", height: "50px",  top: "5px", left: "0px"},
	 content: this.model.properties.name});
      if(this.model.properties.type == "int"){
	this.valueInput = new dijit.form.NumberSpinner(
	  {style: {position: "absolute", width: "200px", top: "0px", left: "150px"},
	   constraints: {min: 0, max: 9999},
	   value: that.model.properties.value,
	   onChange: function(){
	     that.model.properties.value = this.value;
	   }
	  });
      }
      else if(this.model.properties.type == "date"){
	var date;
	if(this.model.properties.value){
	  date = ajweb.date.parse(this.model.properties.value);
	}
	if(!date) date = new Date();
//	console.log(date);
	this.valueInput = new dijit.form.DateTextBox(
	  {style: {position: "absolute", width: "200px", top: "0px", left: "150px"},
	   value: date,
	   onChange: function(){
	     that.model.properties.value = ajweb.date.format(this.value);
	   }
	  });
      }
      else if(this.model.properties.type == "time"){
	var time;
	if(this.model.properties.value){
	  time = ajweb.time.parse(this.model.properties.value);
	}
	if(!time) time = new Date();
	this.valueInput = new dijit.form.TimeTextBox(
	  {style: {position: "absolute", width: "200px", top: "0px", left: "150px"},
	   value: time,
	   onChange: function(){
	     that.model.properties.value = ajweb.time.format(this.value);
	   }
	  });
      }
      else if(this.model.properties.type == "datetime"){
	var date, time;
	if(this.model.properties.value){
	  var dateTime = ajweb.datetime.parse(this.model.properties.value);
	  date = dateTime;
	  time = dateTime;
	}
	if(!date) date = new Date();
	if(!time) time = new Date();
	
	var dateInput = new dijit.form.DateTextBox(
	  {style: {position: "absolute", width: "90px", top: "0px", left: "0px"},
	   value: date,
	   onChange: function(){
	     date = this.value;
	     that.model.properties.value = ajweb.datetime.format(date, time);
	   }
	  });
	var timeInput = new dijit.form.TimeTextBox(
	  {style: {position: "absolute", width: "50px", top: "0px", left: "110px"},
	   value: time,
	   onChange: function(){
	     time = this.value;
	     that.model.properties.value = ajweb.datetime.format(date, time);
	   }
	  });

	this.valueInput = new dijit.layout.ContentPane(
	  {style: {position: "absolute", height: "50px", width: "200px", top: "0px", left: "150px"}
	  });
	this.valueInput.domNode.appendChild(dateInput.domNode);
	this.valueInput.domNode.appendChild(timeInput.domNode);
      }
      else if(this.model.properties.type == "password"){
	this.valueInput = dijit.form.Textarea(
	  {style: {position: "absolute", width: "200px", top: "0px", left: "150px"},
	   value: that.model.properties.value,
	   onChange: function(){
	     that.model.properties.value = this.value;
	   }
	  });
      }
      else {// if(this.model.properties.type == "string"){
	this.valueInput = dijit.form.Textarea(
	  {style: {position: "absolute", width: "200px", top: "0px", left: "150px"},
	   value: that.model.properties.value,
	   onChange: function(){
	     that.model.properties.value = this.value;
	   }
	  });
      }
      this.widget.domNode.appendChild(this.nameLabel.domNode);
      this.widget.domNode.appendChild(this.valueInput.domNode);
      return this.widget.domNode;
    },
    removeDom: function(){
      this.widget.destroyRecursive();
    },
    startup: function(){
      this.inherited(arguments);
      this.widget.startup();
    }
  }
);