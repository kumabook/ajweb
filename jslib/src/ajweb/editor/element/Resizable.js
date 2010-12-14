dojo.provide("ajweb.editor.element.Resizable");
dojo.declare("ajweb.editor.element.Resizable", null,
  /** @lends ajweb.editor.element.Resizable.prototype */
  {
    /**
     * Constructor
     * @class リサイズ可能にするインターフェース。必ずajweb.editor.element.Elementの後にmixinする。
     * @constructs
     */
    constructor: function(opt)
    {
      /**
       * リサイズ用のDOMノード
       * @type HTMLElement
       */
      this.resizeDomNode = this.createResizeDomNode();
    },
    minSize : 10,
    /**
     * リサイズ用のDOMノードを返す。サブクラスでオーバーライド。
     */
    createResizeDomNode: function(){
      this.sizeChange = dojo.doc.createElement("div");
      dojo.style(this.sizeChange, "backgroundColor", "#769DC0");
      dojo.style(this.sizeChange, "position", "absolute");
      dojo.style(this.sizeChange, "bottom", "0px");
      dojo.style(this.sizeChange, "right", "0px");
      dojo.style(this.sizeChange, "width", "10px");
      dojo.style(this.sizeChange, "height", "10px");
      this.domNode.appendChild(this.sizeChange);
      return this.sizeChange;
    },
    /**
    * ドラッグでリサイズ可能にする
    */
    enableDragResize: function(){
      var minSize = this.minSize;
      this.drag_resize_connection
	= dojo.connect(this.resizeDomNode, "onmousedown", this,
	function(e){
	  //				    console.log(this.id + " regist resize");
	  var properties = this.model.properties;
	  var domNode = this.domNode;
	  var x = e.clientX;
	  var y = e.clientY;

	  var width = parseInt(properties.width);
	  var height = parseInt(properties.height);
	  var resize = function(e){
	    var newWidth = width + e.clientX - x;
	    var newHeight = height + e.clientY - y;
	    newWidth = newWidth > minSize ? newWidth : minSize;
	    newHeight = newHeight > minSize ? newHeight : minSize;
	    domNode.style.width = newWidth + "px";
	    domNode.style.height = newHeight + "px";
	    properties.width = newWidth + "px";
	    properties.height = newHeight + "px";
	  };

	  var move_connection = dojo.connect(document, "onmousemove", null, resize);
	  var remove_connection = dojo.connect(document, "onmouseup", this, function(e){
	  dojo.disconnect(move_connection);
	  dojo.disconnect(remove_connection);
	  this.model.updatePropertiesView();
	  this.model.updateDom();				 
	  e.preventDefault();
	  e.stopPropagation();

	  });
	  e.preventDefault();
	  e.stopPropagation();
	});
    },
    /**
    * ドラッグでリサイズ不可能にする
    */
    disableDragResize: function(){
      dojo.disconnect(this.drag_resize_connection);
//      dojo.destory(this.resizeDomNode);
    },
    startup: function(){
      this.enableDragResize();
      this.inherited(arguments);
    }
  }
);





