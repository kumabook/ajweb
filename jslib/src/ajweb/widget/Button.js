
/**
 * @ fileOverview ボタンクラスを記述するファイル
 * 
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.widget.Button");
dojo.require("dijit.form.Button");
dojo.require("ajweb.widget._widget");
dojo.declare("ajweb.widget.Button", ajweb.widget._widget,
{
	/**
	 * Constructor 
	 * @class widgetの抽象クラス 
	 * @constructs
	 * @extends ajWeb.widget._widget
	 * @borrows ajWeb.Widget#id this.id
	 * @borrows ajWeb.Widget#top this.top
	 * @borrows ajWeb.Widget#left this.left
	 * @borrows ajWeb.Widget#element this.element
	 * @borrows ajWeb.Widget#parent this.parent
	 * @borrows ajWeb.Widget#children this.children

	 * @param {Object} opt 設定オプション
	 * @param {String} opt.id ウィジェットID
	 * @param {Object} opt.top 親パネル上端からの相対位置
	 * @param {Object} opt.left 親パネル左端からの相対位置
	 * @param {Object} opt.height 
	 * @param {Object} opt.width 
	 * @param {AjWeb.Widget} opt.parent 親パネルへの参照
	 * @param {Array<AjWeb.Widget>} opt.children 子ウィジェットへの参照

	 * @param {String} opt.text ボタンに表示される文字列
	 * @param {boolean} opt.enable ボタンが使用可能かどうか
	 * @param {function} opt.onclick クリック時に行われる動作
	 */

	constructor : function(opt){

		this.content = opt.content;
		this.top = opt.top;
		this.left = opt.left;
		this.height = opt.height;
		this.width = opt.width;
		this.enable = opt.enable;
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
