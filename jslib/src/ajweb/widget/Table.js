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
dojo.declare("ajweb.widget.Table", ajweb.widget.Widget,
{

	constructor : function(opt){
		this.content = opt.content;
		this.top = opt.top;
		this.left = opt.left;
		this.height = opt.height;
		this.width = opt.width;
		this.enable = opt.enable;
		this.structure = opt.structure;		
		this.rowHeight= opt.rowHeight;		
		this.data= opt.data;///文字列, これからstoreオブジェクト取得するように実装、サーバのJSON関数の実装により
		//delete opt.content;
		//delete opt.top;
		//delete opt.left;
		//delete opt.enable;
		for(var i = 0; i < ajweb.stores.length; i++){//ajweb.storesの中から対応するクライアントテーブルを取得
			if(ajweb.stores[i].id == this.data){
				//		this.store = ajweb.stores[i].store;//dojo store
				this.store = ajweb.stores[i];//ajweb store
			}
		}
	//	this._store = new dojo.data.ItemFileWriteStore({url: this.store});

		this.widget= new dojox.grid.DataGrid({ 
			id: this.id,
			width: this.width,
			height: this.height,
			draggable: true,
			structure: this.structure,
			store: this.store.store
			});
					   
			//this.widget= new dojox.grid.DataGrid(opt);
		this.element = this.widget.domNode;

	},
	startup :function(){
//alert(this.id);
		var store = this.store;	
		var widget = this.widget;
		var width = this.width;
		var height = this.height;
		var top = this.top;
		var left = this.left;
//		this.widget.startup();
		//alert(this.widget.domNode.style.height);
	//	store.fetch({ onComplete: function(items, request){
	//	dojo.forEach(items, function(i){
	///		store.newItem(i);		
//		alert(i);	
//	alert(this.store);
		this.store.select();
		//	});

//		alert(widget);	
//		alert(widget.domNode.style.height);	
	
	//	}


	//});
		widget.startup();
		widget.domNode.style.position = "absolute";
		widget.domNode.style.width = width;

		widget.domNode.style.height = height;
		widget.domNode.style.top = top;
		widget.domNode.style.left = left;


	},

	/**
	 * inspectメソッド：デバッグ情報を出力
	 * @return {String} デバッグ用出力
	 *
	 * @example
	 *  button.inspect();
	 */
	inspect : function(){
		return "TableWidget" + this.id;
	}
});

