/**
 * @fileOverview ラベル要素を記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */


dojo.provide("ajweb.widget.Text");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Text", ajweb.widget.Widget,
/** @lends ajweb.widget.Text */
{
    /** テキストを作成します
     *
     * @constructs
     * @extends ajweb.widget.Widget
     * @borrows ajweb.widget.Widget#id this.id
     * @borrows ajweb.widget.Widget#element this.element
     * @borrows ajweb.widget.Widget#parent this.parent
     * @borrows ajweb.widget.Widget#children this.children

     * @param {Object} opt 設定オプション
     * @param {String} opt.id ウィジェットID
     * @param {String} opt.parent 親フレームID
     */
	constructor : function(opt){
	},
	createWidget: function(){
	  this.widget= document.createElement("div");
	  this.widget.innerHTML = this.content;
	  this.widget.style.position = "absolute";
	  this.widget.style.top = parseInt(this.top)+"px";
	  this.widget.style.left = parseInt(this.left)+"px";
	  this.widget.style.height = parseInt(this.height)+"px";
	  this.widget.style.width = parseInt(this.width)+"px";

	  this.element = this.widget;
	},
	display: function(){
	  this.onDisplay();
	},
	setContent: function(param){
	  this.content = param.content;
	  this.element.innerHTML = param.content;
	},
	onDisplay: function(){
    	},

	/**
	 * inspectメソッド：デバッグ情報を出力
	 * @return {String} デバッグ用出力
	 *
	 * @example
	 *  button.inspect();
	 */
	inspect : function(){
		return "TextWidget" + this.id;
	}
});
