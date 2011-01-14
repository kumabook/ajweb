/**
 * @fileOverview テーブルクラスを記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 *
 */

dojo.provide("ajweb.widget.Table");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojo.dnd.Source");
dojo.require("ajweb.widget.Widget");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.declare("ajweb.widget.Table", //dijit._Widget,
//	     dojox.grid.DataGrid,
ajweb.widget.Widget,
  /** @lends ajweb.widget.Table */
{
    /** テーブルコンポーネントを作成します
     *
     * @constructs
     * @extends ajweb.widget.Widget
     * @borrows ajweb.widget.Widget#id this.id
     * @borrows ajweb.widget.Widget#parent this.parent
     * @borrows ajweb.widget.Widget#children this.children

     * @param {Object} opt 設定オプション
     * @param {String} opt.id ウィジェットID
     * @param {String} opt.parent 親フレームID
     */
  constructor : function(opt){

	},
  createWidget: function(){
    var that = this;
    this.structure = {
      defaultCell: {
	editable: true
      },
      cells: []
    };
    this.store = new dojo.data.ItemFileWriteStore({identifier: "id", data: {  items: []}});
    this.items = [];
    this.widget= new dojox.grid.DataGrid(
      {
	id: this.id,
	style:{
	  position: "absolute",
	  top: this.top,
	  left: this.left,
	  width: this.width,
	  height: this.height
	},
	draggable: true,
//	rowSelector: "20px",
	structure: this.structure,
	store: this.store,
	onRowClick: function(){
	  that.onRowClick();
	}
      });
    this.element = this.widget.domNode;
  },
  /**
   * th要素を追加
   * @return {String} デバッグ用出力
   *
   */
  addChildWidget: function(th){
    this.structure.cells.push(th);
  },
  getItems:function(){
   return this.items;
  },
  getSelectedItem: function(param){
    var items = this.widget.selection.getSelected();
    if(!items.length || items.length == 0) 
      return 0;
    var id = items[0].id;
    for(var i = 0; i <  this.items.length; i++){
      if(this.items[i].id == id){
	  return this.items[i];
      }
    }
    return 0;
  },
  getSelectedItemProperty: function(param){
    var items = this.widget.selection.getSelected();
    if(!items.length || items.length == 0) 
      return 0;
    var id = items[0].id;
    for(var i = 0; i <  this.items.length; i++){
	  return this.items[i][param.property];
    }
    return 0;
  },
// to do 複数選択も可能にする?
  getSelectedItems: function(param){
  },

  insert : function(items){
    if(!items) return;
    if(items.item)
      items = items.item;
    if(dojo.isArray(items)){
      for(var i = 0; i < items.length; i++){
	this.items.push(dojo.mixin({},items[i]));
	this.store.newItem(items[i]);
      }
    }
    this.store.newItem(items);
  },

  load : function(param){
    this.clear();
    for(var i = 0; i < param.item.length; i++){
      this.store.newItem(param.item[i]);
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
    this.items = [];
  },

  sort : function(){

  },
  onRowClick: function(){
  },
  display: function(){
    this.widget.setStructure(this.structure);
    this.widget.startup();
  },
  onDisplay: function(){
  },
  /**
   * inspectメソッド：デバッグ情報を出力
   * @return {String} デバッグ用出力
   *
   */
  inspect : function(){
    return "TableWidget" + this.id;
  }
});



