/**
 * @fileOverview ラベル要素を記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */


dojo.provide("ajweb.widget.Label");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Label", ajweb.widget.Widget,
/** @lends ajweb.widget.Label */
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
	  this.widget= document.createElement("label");
	  this.widget.innerHTML = this.content;
	  this.widget.style.position = "absolute";
	  this.widget.style.top = this.top;
	  this.widget.style.left = this.left;

	  this.element = this.widget;
	},
	display: function(){
	  this.onDisplay();
	},
	setContent: function(content){
	  this.content = content;
	  this.element.innerHTML = content;
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
		return "LabelWidget" + this.id;
	}
});
