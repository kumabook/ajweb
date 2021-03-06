/**
 * @fileOverview ボタンクラスを記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.widget.Button");
dojo.require("dijit.form.Button");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Button",
//	     [dijit.form.Button],
	       ajweb.widget.Widget,
  /** @lends ajweb.widget.Button.prototype */
{

	/**
	 * Constructor
	 * @class Buttonクラス
	 *
	 * @constructs
	 * @extends ajweb.widget.Widget
	 * @borrows ajweb.widget.Widget#id this.id
	 * @borrows ajweb.widget.Widget#parent this.parent
	 * @borrows ajweb.widget.Widget#children this.children

	 * @param {Object} opt 初期化用オブジェクト
	 * @param {String} opt.id ウィジェットID
	 * @param {ajweb.widget.Widget} opt.parent 親パネルへの参照
	 * @param {Array<ajweb.widget.Widget>} opt.children 子ウィジェットへの参照
	 * @param {String} opt.content ボタンに表示される文字列
	 * @param {boolean} opt.enable ボタンが使用可能かどうか
	 * @param {function} opt.onclick クリック時に行われる動作
	 */

  constructor : function(opt){
  },
  createWidget :function(){
    this.widget= new dijit.form.Button({
      id: this.id,
      label: this.content,
      style: {
	position: "absolute",
	top: this.top,
	left: this.left,
	height: this.height,
	width: this.width
      }
    });
    this.element = this.widget.domNode;
    dojo.connect(this.widget, "onClick", this, function(){
		   this.onClick();
    });
  },
  onClick: function(){
  },
  display: function(){
    this.widget.startup();
    this.onDisplay();
  },
  onDisplay : function(){

  },
  /**
   * inspectメソッド：デバッグ情報を出力
   * @return {String} デバッグ用出力
   *
   */
  inspect : function(){
    return "ButtonWidget" + this.id;
  }
});


