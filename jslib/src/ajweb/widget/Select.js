dojo.provide("ajweb.widget.Select");
dojo.require("dijit.form.ComboBox");
dojo.require("ajweb.widget._widget");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.declare("ajweb.widget.Select", ajweb.widget._widget,
{

	constructor : function(opt){

		this.content = opt.content;
		this.top = opt.top;
		this.left = opt.left;
		this.height = opt.height;
		this.width = opt.width;
		this.enable = opt.enable; 
//		this.data= new dojo.data.ItemFileWriteStore();//

		this.data= opt.data;///文字列, これからstoreオブジェクト取得するように実装、サーバのJSON関数の実装により
		//delete opt.content;
		//delete opt.top;
		//delete opt.left;
		//delete opt.enable;
		for(var i = 0; i < ajweb.stores.length; i++){//ajweb.storesの中から対応するクライアントテーブルを取得
			if(ajweb.stores[i].id == this.data){
				this.store = ajweb.stores[i].store;//dojo store
			}
		}
	
		this.widget= new dijit.form.ComboBox({ 
			id: this.id,
			width: this.width,
		//	height: this.height,
			store: this.store 
			});
					   
			//this.widget= new dojox.grid.DataGrid(opt);
		this.element = this.widget.domNode;

	},
	startup :function(){
		var widget = this.widget;
		var width = this.width;
		var height = this.height;
		var top = this.top;
		var left = this.left;
		widget.startup();
		widget.domNode.style.position = "absolute";
	//	widget.domNode.style.width = width;
//		widget.domNode.style.height = height;
		widget.domNode.style.top = top;
		widget.domNode.style.left = left;
//		alert(widget);	
//		alert(widget.domNode.style.height);	
	
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
