/**
 * @fileOverview ラベル要素を記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 0.0.1
 */

/**
 * ラベル要素を作成
 *
 * @class ラベル要素を表わすクラス
 *
 * @param {Object} opt 設定オプション
 * @param {String} opt.id ウィジェットID
 * @param {String} opt.parent 親パネルID
 * @param {Object} opt.top 親パネル上端からの相対位置
 * @param {Object} opt.left 親パネル左端からの相対位置
 * @param {String} opt.text ボタンに表示される文字列
 * @param {function} opt.onclick クリック時に行われる動作
 */

dojo.provide("ajweb.widget.Label");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Label", ajweb.widget.Widget,
{

	constructor : function(opt){

		this.content = opt.content;
		this.top = opt.top;
		this.left = opt.left;
		this.height = opt.height;
		this.width = opt.width;
		this.enable = opt.enable;
		this.onclick = opt.onclick;
		this.widget= document.createElement("label");
		this.widget.innerHTML = this.content;
		this.widget.style.position = "absolute";
//		this.widget.style.width = this.width;
//		this.widget.style.height = this.height;
		this.widget.style.top = this.top;
		this.widget.style.left = this.left;

		this.element = this.widget;

	},
	startup: function(){
	},
	setcontent: function(content){
		this.element.innerHTML = content;
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
