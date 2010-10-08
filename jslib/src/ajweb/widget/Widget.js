/**
 * @fileOverview ajweb.widget._widget を記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */

dojo.provide("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Widget",null,
  /** @lends ajweb.widget.Widget.prototype */
  {
	/**
	 * Constructor 
	 * @class widgetの抽象クラス
	 * @constructs

	 * @param {Object} opt 設定オプション
	 * @param {String} opt.id ウィジェットID
	 * @param {Object} opt.top 親パネル上端からの相対位置
	 * @param {Object} opt.left 親パネル左端からの相対位置
	 * @param {Object} opt.height 
	 * @param {Object} opt.width 
	 * @param {ajweb.widget.Widget} opt.parent 親パネルへの参照
	 * @param {Array<ajweb.widget.Widget>} opt.children 子ウィジェットへの参照
	 */

	constructor: function(opt){
	/** {int} ウィジェットID 
	 * @field */
	  this.id = opt.id;
	/** 親要素からの上端からの位置
	 * @field */
	  this.top = opt.top;
	/** 親要素からの左端からの位置
	 * @field */
	  this.left = opt.left;
	/** DOM要素への参照
	 * @field */
	  this.element = undefined;
	/** 親ウィジェット
	 * @field */
	  this.parent = null;
	/** 子ウィジェット
	 * @field */
	  this.children =[];
  },
  create: function(){
	  this.element.style.width = this.width;
	  this.element.style.height = this.height;
	  this.element.style.top = this.top;
	  this.element.style.left = this.left;
  },
   /** デバッグ用メソッド*/
  inspect : function(){
	  return "ajweb.widget._widget" + this.id;
  },
	/** */
  startup: function(){
	  this.widget.startup();
  }
  });
