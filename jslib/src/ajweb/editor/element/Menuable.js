dojo.provide("ajweb.editor.element.Menuable");
dojo.declare("ajweb.editor.element.Menuable", null,
  /** @lends ajweb.editor.element.Menuable.prototype */
  {
    /**
     * Constructor
     * @class エレメントをドラッグ可能にするインターフェース。必ずajweb.editor.element.Elementの後にmixinする。
     * @constructs
     */
    constructor: function(opt){
       /**
       * 右クリックに反応するDOMノード
       * @type HTMLElement
       */
      this.menuTriggerDomNode = this.createMenuTriggerDomNode();

      /**
       * 右クリックメニューのDOMノード
       */
      this.menu = this.createMenu();

      this.menuAble();
     },
    /**
     * 移動用のDOM要素を返す。サブクラスでオーバーライド
     */
    createMenuTriggerDomNode :function(){
      return this.domNode;
    },
    createMenu :function(){
      var that = this;
      var menu = new dijit.Menu();
      menu.addChild(new dijit.MenuItem({label: "右クリックメニュー" }));
      menu.addChild(new dijit.MenuItem({label: "削除", 
						    onClick: function(){
						      that.model.remove();
						    }}));
      return menu;
    },
    menuAble :function(){
      this.menu.bindDomNode(this.menuTriggerDomNode);
    },
    menuDisable :function(){
      this.menu.unBindDomNode(this.menuTriggerDomNode);
    },
    startup: function(){
      this.inherited(arguments);
    }
  }
);




