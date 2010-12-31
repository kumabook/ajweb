dojo.provide("ajweb.editor.element.Element");
dojo.declare("ajweb.editor.element.Element", null,
  /** @lends ajweb.editor.element.Element.prototype */
  {
    /**
     * Constructor
     * @class モデルを表すDOMノードを管理するクラス
     * @constructs

     * @param {String} opt.id ウィジェットID
     * @param {String} opt.tagName XMLのタグ名
     * @param {DOM} opt.model
     * @param {ajweb.editor.element.ModelElement | dijit.layout.TabContainer} opt.container コンテナ要素
     *  ajweb.editor.element.Elementまたはdijit.layout.TabContainer
     */
    constructor: function(opt)
    {
      /**
       * id
       * @type String
       */
      this.id = opt.id;
      /**
       * このdom要素が表すモデル
       * @type ajweb.editor.model.AbstractModel
       */
      this.model = opt.model;
      /**
       * タブコンテナに配置される場合のタイトル文字列
       * @type String
       */
      this.title = opt.title;
      /**
       * DOM要素が配置される親要素
       * @type @type ajweb.editor.element.Element|dijit.layout.TabContainer
       */

      this.container = opt.container;

      /**
       * この要素のDOM要素(この要素がcontainer要素のcontainerDomの下に配置される)
       * @type HTMLElement
       */
      this.domNode = this.createDom(opt.properties);
      /**
       * 子要素を配置するDOM要素
       * @type HTMLElement
       */
      this.containerNode = this.createContainerNode();
      if(this.container instanceof ajweb.editor.element.Element){
	if(this.container.containerNode)
	  this.container.containerNode.appendChild(this.domNode);

      }
      else　{// centerTcの場合
	this.container.addChild(this.widget);
	this.container.selectChild(this.widget);
      }
      /**
       * 表示されているどうか
       */
      this.isDisplay = true;

      ajweb.addElement(this);
    },
    /**
     * DOM要素を作成し、そのDOM要素を返す。抽象メソッド、サブクラスでオーバライドして使う。
     */
    createDom: function(properties){
    },
    /**
     * DOM要素:this.domNodeの内容をプロパティに従ってを更新する。抽象メソッド、サブクラスでオーバライドして使う。
     */
    updateDom: function(){

    },
    /**
     * DOM要素を削除する。抽象メソッド、サブクラスでオーバライドして使う。主に所属するmodelオブジェクトから呼び出される。
     */
    removeDom: function(properties){
    },
    /**
     * 子要素を配置するDOMを作成する。
     */
    createContainerNode: function(){
      return this.domNode;
    },
    /**
     * 作成したDOM要素を表示する前に呼び出される。D&Dやリサイズなどのイベント登録をここで行う。
     * サブクラスでオーバライドする、
     * その際ミックスインしたインターフェースのメソッドを呼び出すようにthis.inherited(arguments)を呼び出す
     * 所属するモデル側で自動的に呼び出される。
     */
    startup: function(){
      if(!(this.enableDragMove)){
	dojo.connect(this.domNode, "onmousedown", this.model, this.model.updatePropertiesView);
	dojo.connect(this.domNode, "onmousedown", this.model, this.model.updateEventView);
      }
      this.inherited(arguments);
    }
  }
);