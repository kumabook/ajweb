/**
 * @fileOverview セレクトボックスコンポーネントを記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.widget.Selectbox");
dojo.require("dijit.form.ComboBox");
dojo.require("ajweb.widget.Widget");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.declare("ajweb.widget.Selectbox", ajweb.widget.Widget,
  /** @lends ajweb.widget.Selectbox */
{
  /** セレクトボックスコンポーネントを作成します
   *
   * @constructs
   * @extends ajweb.widget.Widget
   * @borrows ajweb.widget.Widget#id this.id
   * @borrows ajweb.widget.Widget#element this.element
   * @borrows ajweb.widget.Widget#parent this.parent
   * @borrows ajweb.widget.Widget#children this.children

   * @param {Object} opt 設定オプション
   * @param {String} opt.id ウィジェットID
   * @param {String} opt.parent 親フレームID
   * @param {String} opt.isRoot ルートかどうか
   * @param {Object} opt.top 親パネル上端からの相対位置
   * @param {Object} opt.left 親パネル左端からの相対位置
   * @param {Object} opt.width
   * @param {String} opt.label
   * @param {Object} opt.size 大きさ
   * @param {Object} opt.onload
   */
  constructor : function(opt){

  },
  /**
   * this.elementにDOMノードを設定
   *
   */
  createWidget : function(){
    this.store = new dojo.data.ItemFileWriteStore({ data: {identifier: "id", label: this.label, items: []}});
    this.items = [];
    this.widget= new dijit.form.ComboBox({
      id: this.id,
      store: this.store,
      style: {
	position: "absolute",
	top: this.top,
	left: this.left,
	width: this.width,
	height: this.height
      },
      name: "room",
      searchAttr: "name"
      });
    this.element = this.widget.domNode;
  },
  /**
   * データベース要素のidとカラム名を指定して候補を代入
   */
  load: function(param){
    var newItems;
    if(param.datum!=null)
      newItems= param.datum;
    else
      newItems= param;
    var that = this;

    this.clear();
    for(var i = 0; i < newItems.length; i++){
      this.newItem(newItems[i]);
    }
  },
  clear : function(){
    var store = this.store;
    this.store.fetch({
      onComplete: function(items, request){
	for(var i = 0; i < items.length; i++){
	  store.deleteItem(items[i]);
	}
      }
    }
    );
    store.save();
    this.items = [];
  },

  newItem: function(item){
    this.items.push(dojo.mixin({},item));
    this.store.newItem(item);
  },
  getValue: function(){
    return  this.widget.getValue();
  },
  getSelectItem: function(param){
    var value = this.widget.getValue();
    for(var i = 0; i <  this.items.length; i++){
      if(this.items[i][this.label] == value){
	if(!param || !param.property){
	  return this.items[i];
	}
	else
	  return this.items[i][param.property];
	}
      }
      return 0;
  },
  getSelectItemProperty: function(param){
    var value = this.widget.getValue();
    for(var i = 0; i <  this.items.length; i++){
      if(this.items[i][this.label] == value){
	if(!param || !param.property){
	  return this.items[i];
	}
	else
	  return this.items[i][param.property];
	}
      }
      return "0";
  },

  display :function(){
    this.widget.startup();
    this.onDisplay();
  },
  onDisplay:function(){},
  /**
   * inspectメソッド：デバッグ情報を出力
   * @return {String} デバッグ用出力
   */
  inspect : function(){
    return "Selectbox:" + this.id;
  },
  reload: function(){
  }
});

