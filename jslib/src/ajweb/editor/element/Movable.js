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
       * マウスに反応するのDOMノード
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
    createMoveContainerDomNode :function(){
      return this.container.containerNode;
    },
    /**
     * ドラッグで移動可能にする
     */
    enableDragMove: function(){//改良の余地あり 
    //		 console.log(this.id + "   enableDragMove");

      this.drag_move_connection
	= dojo.connect(this.moveTriggerDomNode, "onmousedown", this,
	function(e){
	  //console.log(this.id + " regist move");
//	  this.model.updatePropertiesView();
//	  this.model.updateEventView();
	  var top, left, width, height;
	  if(!this.domNode.style.top)  top = 0;
	  else  top = parseInt(this.domNode.style.top);
	  if(!this.domNode.style.left) left = 0;
	  else  left = parseInt(this.domNode.style.left);
	  top = top - e.clientY;
	  left = left - e.clientX;

	  if(!this.domNode.style.width)  width = 0;
	  else  width = parseInt(this.domNode.style.width);
	  if(!this.domNode.style.height) height = 0;
	  else  height = parseInt(this.domNode.style.height);
	  
	  var container_width = parseInt(this.moveContainerDomNode.style.width) - parseInt(width);//ここにスクロールバーも計算にいれるとよい?
	  var container_height = parseInt(this.moveContainerDomNode.style.height) - parseInt(height);
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
	    //lineがあれば更新
//	    this.count++;
	    if(this.container.draw!=undefined){// && this.count > 1){
	      this.container.reDrawChild(this);
	     /* for(var i = 0; i < this.container.lines.length; i++){
		if(this.container.lines[i].start == this.domNode 
		   || this.container.lines[i].end == this.domNode){
		  this.container.reDraw(this.container.lines[i]);
		}
	      }*/
	    }
	  };
	  var move_connection = dojo.connect(document, "onmousemove", this, move);
	  var remove_connection  = dojo.connect(document, "onmouseup", this, function(e){
						  dojo.disconnect(move_connection);
						  dojo.disconnect(remove_connection);
						  
						  var container = this.container.containerNode;//domNode
						  var left = ajweb.editor.getX(this.domNode) - ajweb.editor.getX(container) + 1 + "px";
						  var top = ajweb.editor.getY(this.domNode) - ajweb.editor.getY(container) + 1 + "px";
						  if(top != this.model.properties.top || left != this.model.properties.left){
						    this.model.properties.top = top;
						    this.model.properties.left = left;
						    this.model.updatePropertiesView();
						    this.model.updateEventView();      
						  }

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
    startup: function(){
      this.enableDragMove();
      this.inherited(arguments);
    }
  }
);





