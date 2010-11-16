dojo.provide("ajweb.widget.Passwordbox");
dojo.require("dijit.form.TextBox");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Passwordbox",ajweb.widget.Widget,
/** @lends ajweb.widget.Passwordox */

{
  /** テキストボックスコンポーネントを作成します
   *
   * @constructs
   * @extends ajweb.widget.Widget
   * @borrows ajweb.widget.Widget#id this.id
   * @borrows ajweb.widget.Widget#parent this.parent
   * @borrows ajweb.widget.Widget#children this.children

   * @param {Object} opt 設定オプション
   * @param {String} opt.id ウィジェットID
   * @param {String} opt.parent 親フレームID
   * @param {String} opt.isRoot ルートかどうか
   * @param {Object} opt.top 親パネル上端からの相対位置
   * @param {Object} opt.left 親パネル左端からの相対位置
   * @param {Object} opt.height
   * @param {Object} opt.width
   * @param {Object} opt.size 大きさ
   * @param {Object} opt.onload
   */
  constructor: function(opt){
  },
  createWidget: function(){
        this.widget = new dijit.form.TextBox({
                        id: this.id,
//                      maxLength: 10,
                        style: {
                          position: "absolute",
                          top: this.top,
                          left: this.left,
                          width: this.width
                        },
			value: this.value,
			type: "password"
        });
        this.element = this.widget.domNode;

  },
  getValue: function(){
    if(!this.widget.value){
      return "";
    }
    return CybozuLabs.MD5.calc(this.widget.value);
  },

  startup: function(){
    this.widget.startup();
  }
});
