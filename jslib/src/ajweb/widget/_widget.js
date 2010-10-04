/*
 * widgetのスーパークラスを定義
 * 
 * top,left, visibility,wIdをもつ

/**
 * @fileOverview ajwidget を記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */

dojo.provide("ajweb.widget._widget");
dojo.declare("ajweb.widget._widget",null,
  /** @lends AjWeb.Widget.prototype */
  {
	/**
	 * Description of constructor 
	 * @class widgetの抽象クラス 
	 * @constructs
	 *
	 * @param {Object} opt 設定オプション
	 * @param {String} opt.id ウィジェットID
	 * @param {Object} opt.top 親パネル上端からの相対位置
	 * @param {Object} opt.left 親パネル左端からの相対位置
	 * @param {AjWeb.Widget} opt.parent 親パネルへの参照
	 * @param {Array<AjWeb.Widget>} opt.children 子ウィジェットへの参照
	 */
	constructor: function(opt){

	  this.id = opt.id;
	  this.top = opt.top;
	  this.left = opt.left;

	  this.element = undefined;
	  this.parent = null;
	  this.children =[];
  },
  create: function(){
	  this.element.style.width = this.width;
	  this.element.style.height = this.height;
	  this.element.style.top = this.top;
	  this.element.style.left = this.left;
  },
	/** ウィジェットID */
	id : 0,
	/** 親パネル上端からの相対位置*/
	top : 0,
	/** 親パネル左端からの相対位置*/
	left : 0,
	/** DOM要素への参照*/
	element : null,
	/** 親ウィジェット*/
	parent: null,
	/** 子ウィジェット*/
	children: [], 
	/** デバッグ用メソッド*/
	inspect : function(){
	  return "ajWeb.widget._widget" + this.id;
  },
  startup: function(){
	  this.widget.startup();
  }
  });


