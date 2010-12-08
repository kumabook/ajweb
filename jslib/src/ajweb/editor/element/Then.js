dojo.require("ajweb.editor.element.Element");
dojo.require("ajweb.editor.element.DndEnable");
dojo.require("ajweb.editor.element.Movable");
dojo.require("ajweb.editor.element.Removable");
dojo.require("dijit.TitlePane");
dojo.provide("ajweb.editor.element.Then");
dojo.declare("ajweb.editor.element.Then",
	      ajweb.editor.element.Action,

  /** @lends ajweb.editor.element.Then.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するオブジェクト
     * @constructs
     * @borrows ajweb.editor.element.Element#id this.id
     * @borrows ajweb.editor.element.Element#model this.model
     * @borrows ajweb.editor.element.Element#title this.title
     * @borrows ajweb.editor.element.Element#container this.container
     * @borrows ajweb.editor.element.Element#domNode this.domNode
     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {DOM} opt.model
     * @param {DOM} opt.container コンテナ要素
     */
    constructor: function(opt)
    {
    },
    createInitLine: function(){
      this.line = this.container.draw(this.model.parent.element.domNode, this.domNode, this.model.tagName);
      this.container.lines.push(this.line);
      this.container.domNode.appendChild(this.line.domNode);      
    }
  }
);