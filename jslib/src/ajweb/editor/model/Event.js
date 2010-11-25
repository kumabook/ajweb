dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Event");

dojo.provide("ajweb.editor.model.Event");
dojo.declare("ajweb.editor.model.Event", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.EventModel.prototype */
  {
    /**
     * Constructor
     * @class イベントモデルのクラス
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {Array} opt.acceptComponentType 子要素に持てる要素
     * @param {DOM} opt.parent 配置されるDOM要素
     */
    constructor: function(opt)
    {
      this.conditions = [];
      this.action = [];
      this.target = opt.target;
      this.type = opt.type;
    }
  }
);
