/**
 * @fileOverview ajweb.widget._widget を記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */

dojo.provide("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Widget", null,
  /** @lends ajweb.widget.Widget.prototype */
  {
	/**
	 * Constructor
	 * @class widgetの抽象クラス
	 * @constructs

	 * @param {Object} opt 設定オプション
	 * @param {String} opt.id ウィジェットID
	 * @param {ajweb.widget.Widget} opt.parent 親パネルへの参照
	 * @param {Array<ajweb.widget.Widget>} opt.children 子ウィジェットへの参照
	 */

	constructor: function(opt){
	  dojo.mixin(this, opt);
	 /** {int} ウィジェットID
	 * @field */
	  this.id = opt.id;
	/** DOM要素への参照
	 * @field */
	  this.element = undefined;
	/** 親ウィジェット
	 * @field */
	  this.parent = null;
	/** 子ウィジェット
	 * @field */
	  this.children =[];
	  this.createWidget();
	  ajweb.addElement(this);
  },
    /**
     * このメソッドをオーバーライドし、オブジェクトを作成、frameやpanelの子要素となる場合は,
     * this.elementにDOMノードを設定する。
     */
  createWidget: function(){
    new Error("please override super class: ajweb.widget.Widget createWidget");
  },
    /**
     * 子要素をもつウィジェットは、このメソッドをオーバーライドし、子ウィジェットを追加する
     */
  addChildWidget: function(child){
    this.children.push(child);
    child.parent = this;
    //new Error("this widget cannot have child widget");
  },
   /** デバッグ用メソッド*/
  inspect : function(){
	  return "ajweb.widget._widget" + this.id;
  },
	/**
	 * 要素がすべて生成された後のタイミングで呼び出される。
	 * このメソッドをオーバライドし、DOMの調整を行う。
	 */
  display: function(){
    this.onDisplay();
  },
  onDisplay: function(){

  }
});
