/**
 * @fileOverview ボタンクラスを記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.widget.Button");
dojo.require("dijit.form.Button");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Button", ajweb.widget.Widget,
  /** @lends ajweb.widget.Button.prototype */
{

	/**
	 * Constructor
	 * @class Buttonクラス
	 *
	 * @constructs
	 * @extends ajweb.widget.Widget
	 * @borrows ajweb.widget.Widget#id this.id
	 * @borrows ajweb.widget.Widget#top this.top
	 * @borrows ajweb.widget.Widget#left this.left
	 * @borrows ajweb.widget.Widget#element this.element
	 * @borrows ajweb.widget.Widget#parent this.parent
	 * @borrows ajweb.widget.Widget#children this.children

	 * @param {Object} opt 初期化用オブジェクト
	 * @param {String} opt.id ウィジェットID
	 * @param {Object} opt.top 親パネル上端からの相対位置
	 * @param {Object} opt.left 親パネル左端からの相対位置
	 * @param {Object} opt.height
	 * @param {Object} opt.width
	 * @param {ajweb.widget.Widget} opt.parent 親パネルへの参照
	 * @param {Array<ajweb.widget.Widget>} opt.children 子ウィジェットへの参照

	 * @param {String} opt.text ボタンに表示される文字列
	 * @param {boolean} opt.enable ボタンが使用可能かどうか
	 * @param {function} opt.onclick クリック時に行われる動作
	 */

	constructor : function(opt){

		this.content = opt.content;
		/** 高さ
		 * @field*/
		this.height = opt.height;
		/** 幅
		 * @field */
		this.width = opt.width;
		this.enable = opt.enable;
		/** クリック時の動作
		 * @function */
		this.onclick = opt.onclick;
		this.widget= new dijit.form.Button({
			id: this.id,
			label: this.content
		});
		this.widget.domNode.style.position = "absolute";
		this.widget.domNode.style.width = this.width;
		this.widget.domNode.style.height = this.height;
		this.widget.domNode.style.top = this.top;
		this.widget.domNode.style.left = this.left;

		this.element = this.widget.domNode;

	},

	/**
	 * inspectメソッド：デバッグ情報を出力
	 * @return {String} デバッグ用出力
	 *
	 * @example
	 *  button.inspect();
	 */
	inspect : function(){
		return "ButtonWidget" + this.id;
	}
});
