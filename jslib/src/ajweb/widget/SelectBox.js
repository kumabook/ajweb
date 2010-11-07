/**
 * @fileOverview セレクトボックスコンポーネントを記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.widget.SelectBox");
dojo.require("dijit.form.ComboBox");
dojo.require("ajweb.widget.Widget");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.declare("ajweb.widget.SelectBox", ajweb.widget.Widget,
  /** @lends ajweb.widget.SelectBox */
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
	    top: this.top,
	    left: this.left,
	    width: this.width,
	    store: this.store,
	    style: {
	      position: "absolute",
	      top: "50px",
	      left: "100px"
	    },
	    name: "room",
	    store: this.store,
	    searchAttr: "name"
	      });
	  //this.widget= new dojox.grid.DataGrid(opt);
	      this.element = this.widget.domNode;
	},
	/**
	 * データベース要素のidとカラム名を指定して候補を代入
	 */
	load: function(newItems){
	  var that = this;

	  this.clear();
 	  for(var i = 0; i < newItems.length; i++){
	        this.newItem(newItems[i]);
	  }
/*	  this.store.fetch({
	    onItem: function(item, request){
	      that.store.deleteItem(item);
	    },
	    onComplete: function(items, request){
	      that.store.save();//store._pendingをクリア
	      that.items = [];
	      for(var i = 0; i  < newItems.length; i++){
		that.newItem(newItems[i]);
	      }
	    }
	  }
	  );*/
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
	      if(!param)
		return this.items[i];
	      else
		return this.items[i][param.property];
	    }
	  }
	  return 0;
	},

	startup :function(){
		this.widget.startup();
	},
	/**
	 * inspectメソッド：デバッグ情報を出力
	 * @return {String} デバッグ用出力
	 *
	 * @example
	 *  button.inspect();
	 */

	inspect : function(){
		return "SelectBoxWidget" + this.id;
	},
	reload: function(){

	}
});

