dojo.provide("ajweb.editor.element.Movable");
dojo.declare("ajweb.editor.element.Movable", null,
  /** @lends ajweb.editor.element.Movable.prototype */
  {
    /**
     * Constructor
     * @class エレメントをドラッグ可能にするインターフェース。必ずajweb.editor.element.Elementの後にmixinする。
     * @constructs
     */
    constructor: function(opt){
       /**
       * 移動用のDOMノード
       * @type HTMLElement
       */
      this.moveDomNode = this.createMoveDomNode();
       /**
       * マウスに反応するDOMノード
       * @type HTMLElement
       */
      this.moveTriggerDomNode = this.createMoveTriggerDomNode();
       /**
       * 移動範囲の境界となるDOM要素
       * @type HTMLElement
       */
      this.moveContainerDomNode = this.createMoveContainerDomNode();
      this.count = 0;
     },
    /**
     * 移動用のDOM要素を返す。サブクラスでオーバーライド
     */
    createMoveDomNode :function(){
      return this.domNode;
    },
    /**
     * マウスに反応するDOM要素を返す。サブクラスでオーバーライド
     */
    createMoveTriggerDomNode :function(){
      return this.domNode;
    },
    /**
     * 移動範囲の境界となるのDOM要素を返す。サブクラスでオーバーライド
     */
    createMoveContainerDomNode : function(){
      return this.container.containerNode;
    },
    /**
     * ドラッグで移動可能にする
     */
    enableDragMove: function(){//todo 改良の余地あり
    //		 console.log(this.id + "   enableDragMove");

      this.drag_move_connection
	= dojo.connect(this.moveTriggerDomNode, "onmousedown", this,
	function(e){
	  //console.log(this.id + " regist move");
	  this.model.updatePropertiesView();
	  this.model.updateEventView();
	  var top, left, width, height;
	  if(!this.moveDomNode.style.top)  top = 0;
	  else top = parseInt(this.moveDomNode.style.top);
	  if(!this.moveDomNode.style.left) left = 0;
	  else left = parseInt(this.moveDomNode.style.left);
	  top = top - e.clientY;
	  left = left - e.clientX;

	  if(!this.moveDomNode.style.width)  width = 0;
	  else  width = parseInt(this.moveDomNode.style.width);
	  if(!this.moveDomNode.style.height) height = 0;
	  else  height = parseInt(this.moveDomNode.style.height);

	  var container_width = this.moveContainerDomNode.scrollWidth ? this.moveContainerDomNode.scrollWidth :
	      parseInt(this.moveContainerDomNode.style.width) - parseInt(width);//ここにスクロールバーも計算にいれるとよい?
	  var container_height = this.moveContainerDomNode.scrollHeight ? this.moveContainerDomNode.scrollHeight :
	      parseInt(this.moveContainerDomNode.style.height) - parseInt(height);
/*	  console.log(this.moveContainerDomNode.scrollWidth);
	  console.log(this.moveContainerDomNode.scrollLeft);
	  console.log(this.moveContainerDomNode.offsetWidth);
	  console.log(this.moveContainerDomNode.offsetLeft);*/

	  var move = function(e){
	    var _x = e.clientX + left;
	    var _y = e.clientY + top;
	    if(_x < container_width-1 &&  _x > 0){
	      this.moveDomNode.style.left = _x + "px";
	    }
	    if(_y < container_height-1 &&  _y > 0){
	      this.moveDomNode.style.top = _y + "px";
	    }

	    //lineがあれば更新
//	    this.count++;
	    var lineContainer;
	    if(this.container.draw)
	      lineContainer = this.container;
	    else if(this.draw)
	      lineContainer = this;
//	    if(this.container.draw!=undefined){// && this.count > 1){
	    if(lineContainer){
	     lineContainer.reDrawChildNode(this.moveDomNode);
	    }
	  };
	  var move_connection = dojo.connect(document, "onmousemove", this, move);
	  var remove_connection  = dojo.connect(document, "onmouseup", this, function(e){
						  dojo.disconnect(move_connection);
						  dojo.disconnect(remove_connection);

						  var container = this.container.containerNode;//domNode
						  var left = ajweb.editor.getX(this.moveDomNode) - ajweb.editor.getX(container) + 1 + "px";
						  var top = ajweb.editor.getY(this.moveDomNode) - ajweb.editor.getY(container) + 1 + "px";
						  if(top != this.model.properties.top || left != this.model.properties.left){
						    this.model.properties.top = top;
						    this.model.properties.left = left;
						    this.model.updatePropertiesView();
						    this.model.updateEventView();
						  }

						  e.preventDefault();
						  e.stopPropagation();
						});

	  if(this.menu)
	    if((ajweb.Browser.IE && e.button != 1) || e.button != 0)
	      this.menu._openMyself({target: this.menuTriggerDomNode});
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
    startup: function(){
      this.inherited(arguments);
      this.enableDragMove();
    }
  }
);





