dojo.provide("ajweb.editor.element.Removable");
dojo.declare("ajweb.editor.element.Removable", null,
  /** @lends ajweb.editor.element.Removable.prototype */
  {
    /**
     * Constructor
     * @class DOMノードを削除可能にするインターフェース。必ずajweb.editor.element.Elementの後にmixinする。
     * @constructs
     */
    constructor: function(opt)
    {
      /**
       * 削除ボタンにあたるDOMノード
       * @type HTMLElement
       */
      this.removeDomNode = this.createRemoveDomNode();
    },
    /**
     * 削除ボタンにあたるDOMノードを返す。必要に応じてサブクラスオーバーライド
     */
    createRemoveDomNode: function(){
      var deleteArea = document.createElement("div");
      deleteArea.className = "dijitDialogCloseIcon";

      this.domNode.appendChild(deleteArea);
      return deleteArea;
    },   
    removable: function(){
      dojo.connect(this.removeDomNode, "onclick", this.model, this.model.remove);
    },
    startup: function(){
      this.removable();
      this.inherited(arguments);
    }
 }
);





