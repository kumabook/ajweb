/**
 * @fileOverview テキストボックスコンポーネントを記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.widget.TextBox");
dojo.require("dijit.form.TextBox");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.TextBox",ajweb.widget.Widget,
/** @lends ajweb.widget.TextBox */

{
  /** テキストボックスコンポーネントを作成します
   *
   * @constructs
   * @extends ajweb.widget.Widget
   * @borrows ajweb.widget.Widget#id this.id
   * @borrows ajweb.widget.Widget#top this.top
   * @borrows ajweb.widget.Widget#left this.left
   * @borrows ajweb.widget.Widget#element this.element
   * @borrows ajweb.widget.Widget#parent this.parent
   * @borrows ajweb.widget.Widget#children this.children

   * @param {Object} opt 設定オプション
   * @param {String} opt.id ウィジェットID
   * @param {String} opt.parent 親フレームID
   * @param {String} opt.isRoot ルートかどうか
   * @param {Object} opt.top 親パネル上端からの相対位置
   * @param {Object} opt.left 親パネル左端からの相対位置
   * @param {Object} opt.height 親パネル左端からの相対位置
   * @param {Object} opt.width 親パネル左端からの相対位置
   * @param {Object} opt.size 大きさ
   * @param {Object} opt.onload 親パネル左端からの相対位置
   */

  constructor: function(opt){

	this.content = opt.content;
	/** サイズ
	 * @field
	 * */
	this.size = opt.size;
	this.width = opt.width;
	this.height= opt.height;
	/** 入力値(初期値)
	 * @field */
	this.value = opt.value;
	this.parent = opt.parent;

	this.widget = new dijit.form.TextBox({
		id: this.id
	});
	this.element = this.widget.domNode;
	this.element.value = opt.content;
	this.widget.domNode.style.position = "absolute";
	this.widget.domNode.style.width = this.width;
//	this.widget.domNode.style.height = this.height;
	this.widget.domNode.style.top = this.top;
	this.widget.domNode.style.left = this.left;

}
  });


