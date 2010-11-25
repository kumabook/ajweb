dojo.require("dijit.Dialog");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");

dojo.provide("ajweb.editor.element.Element");
dojo.declare("ajweb.editor.element.Element", null,
  /** @lends ajweb.editor.element.Model.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {DOM} opt.model
     * @param {ajweb.editor.element.ModelElement | dijit.layout.TabContainer} opt.container コンテナ要素
     *  ajweb.editor.element.Elementまたはdijit.layout.TabContainer
     */
    constructor: function(opt)
    {
      /**
       * id
       * @type String
       */
      this.id = opt.id;
      /**
       * このdom要素が表すモデル
       * @type ajweb.editor.model.AbstractModel
       */
      this.model = opt.model;
      this.title = opt.title;
      this.acceptComponentType = this.model.acceptComponentType;
      /**
       * DOM要素が配置される親要素
       * @type @type ajweb.editor.element.Element|dijit.layout.TabContainer
       */
      this.container = opt.container;
      /**
       * この要素のDOM要素
       * @type HTMLElement
       */
      this.domNode = this.createDom(opt.properties);

      if(this.container instanceof ajweb.editor.element.Element)
	this.container.domNode.appendChild(this.domNode);
      else// centerTcの場合
	this.container.addChild(this.widget);
      this.startup();
      ajweb.addElement(this);
    },
    /**
     * DOM要素を作成し、そのDOM要素を返す。抽象メソッド、サブクラスでオーバライドして使う。
     */
    createDom: function(properties){
    },
    /**
     * DOM要素:this.domNodeの内容をプロパティに従ってを更新する。抽象メソッド、サブクラスでオーバライドして使う。
     */
    updateDom: function(){

    },
    /**
     * DOM要素:this.domNodeを画面から削除。抽象メソッド、サブクラスでオーバライドして使う。
     */
    removeDom: function(){

    },
    /**
     * 作成したDOM要素を表示する前に呼び出される。D&Dやリサイズなどのイベント登録をここで行う。抽象メソッド、サブクラスでオーバライドして使う。
     */
    startup: function(){
    },
    /**
    * ドロップ可能かチェックする
    * @param {String} ウィジェットタイプ
    */
    checkAcceptance: function(widgetType){
      if(ajweb.contains(this.acceptComponentType, widgetType))
	return true;
      else
	return false;
    },
   /**
    * ドラッグアンドドロップ可能にする
    */
    dndEnable : function(){
      var that = this;
      var acceptComponentType = this.acceptComponentType;
      this.dnd = new dojo.dnd.Source(
	this.domNode,
	{
	  accept: ["text", "treeNode"],
	  checkAcceptance : function(source, nodes){
	    var component = ajweb.editor.getComponent(nodes[0].childNodes[2].childNodes[2].innerHTML);
	    return that.checkAcceptance(component.elementType);
	  },
	  onDrop: function(sources, nodes, copy){
/*	    var name = nodes[0].childNodes[2].childNodes[2].innerHTML;
	    var component = ajweb.editor.getComponent(name);
	    var elementType = component.elementType;
	    var model = component.modelType;
	    var container = that;
	    var Model = model.substr(0,1).toLocaleUpperCase() + model.substr(1);
	    var top =  ajweb.editor.mousePosition.y - ajweb.editor.getY(container.domNode);
	    var left =  ajweb.editor.mousePosition.x - ajweb.editor.getX(container.domNode);
	    var id = name + ajweb.editor.modelCount(name);
	    var properties = dojo.clone(component.defaultProperties);
	    properties.top = top;
	    properties.left = left;
	    properties.id = id;

	    return new ajweb.editor.model[Model](
	      {
		id: id,
		tagName: name,
		elementType: elementType,
		properties: properties,
		propertyList: component.propertyList,
		propertyDataStore: that.model.propertyDataStore,
		eventList: component.eventList,
		eventTc: that.model.eventTc,
		acceptComponentType: component.acceptComponentType,
		parent: that.model.parent,
		container: container
	      }
	    );
*/
	    ajweb.editor.createModel(
	      nodes[0].childNodes[2].childNodes[2].innerHTML,
	      that.model,
	      that.model.element,
	      that.model.propertyDataStore,
	      that.model.eventTc
	    );
	  }
	}
      );
    },
    /**
    * ドラッグアンドドロップ可能にする
    */
    dndDisable: function(){
      this.dnd.destory();
    },
    /**
    * ドラッグで移動可能にする
    */
    enableDragMove: function(){//改良の余地あり
    //		 console.log(this.id + "   enableDragMove");
      this.drag_move_connection
	= dojo.connect(this.domNode, "onmousedown", this,
	function(e){
	  		//		    console.log(this.id + " regist move");
	  var left = parseInt(this.domNode.style.left) - e.clientX;;
	  var top = parseInt(this.domNode.style.top) - e.clientY;;
	  var container_width = parseInt(this.container.domNode.style.width) - parseInt(this.domNode.style.width);
	  var container_height = parseInt(this.container.domNode.style.height) - parseInt(this.domNode.style.height);

	  var move = function(e){
	    var _x = e.clientX + left;
	    var _y = e.clientY + top;
	    if(_x < container_width-1 &&  _x > 0){
	      this.domNode.style.left = _x + "px";
	    }
	    if(_y < container_height-1 &&  _y > 0){
					this.domNode.style.top = _y + "px";
	    }
	    //				      console.log("drag move " + _x + "  " + _y);
	  };
	  var move_connection = dojo.connect(document, "onmousemove", this, move);
	  var remove_connection  = dojo.connect(document, "onmouseup", this, function(e){
						  dojo.disconnect(move_connection);
						  dojo.disconnect(remove_connection);
						  //									    console.log(this.id + " drag end");
						  this.model.updatePropertiesView();
						  e.preventDefault();
						  e.stopPropagation();
						});
	  e.preventDefault();
	  e.stopPropagation();
	});
    },
    /**
    * ドラッグで移動不可能にする
    */
    disableDragMove: function(){
      dojo.disconnect(this.drag_move_connection);
    },
    /**
    * ドラッグでリサイズ可能にする
    */
    enableDragResize: function(){
      this.sizeChange = dojo.doc.createElement("div");
      dojo.style(this.sizeChange, "backgroundColor", "#769DC0");
      dojo.style(this.sizeChange, "position", "absolute");
      dojo.style(this.sizeChange, "bottom", "0px");
      dojo.style(this.sizeChange, "right", "0px");
      dojo.style(this.sizeChange, "width", "10px");
      dojo.style(this.sizeChange, "height", "10px");
      this.domNode.appendChild(this.sizeChange);

      this.drag_resize_connection
	= dojo.connect(this.sizeChange, "onmousedown", this,
	function(e){
	  //				    console.log(this.id + " regist resize");
	  var properties = this.model.properties;
	  var domNode = this.domNode;
	  var x = e.clientX;
	  var y = e.clientY;

	  var width = parseInt(properties.width);
	  var height = parseInt(properties.height);
	  var resize = function(e){
	    var dx = e.clientX - x;
	    var dy = e.clientY - y;
	    domNode.style.width = (width + dx) + "px";
	    domNode.style.height = (height + dy) + "px";
	    properties.width = (width + dx) + "px";
	    properties.height = (height + dy) + "px";
	  };

	  var move_connection = dojo.connect(document, "onmousemove", null, resize);
	  var remove_connection = dojo.connect(document, "onmouseup", this, function(e){
	  dojo.disconnect(move_connection);
	  dojo.disconnect(remove_connection);
	  this.model.updatePropertiesView();

	  e.preventDefault();
	  e.stopPropagation();

	  });
	  e.preventDefault();
	  e.stopPropagation();
	});


    },
    /**
    * ドラッグでリサイズ可能にする
    */
    disableDragResize: function(){
      dojo.disconnect(this.drag_resize_connection);
      dojo.destory(this.sizeChange);
    }

  }
);





