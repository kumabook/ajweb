/** 
 * @fileOverview 画面を記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0 
 */
dojo.provide("ajweb.widget.Panel");
dojo.require("dijit.layout.ContentPane");
dojo.require("ajweb.widget._widget");
dojo.declare("ajweb.widget.Panel",ajweb.widget._widget,
/** @lends AjWeb.Panel.prototype */ 
 {
   /**
	* @constructs
	* @extends AjWeb.Widget
	* @borrows AjWeb.Widget#id this.id
	* @borrows AjWeb.Widget#top this.top
	* @borrows AjWeb.Widget#left this.left
	* @borrows AjWeb.Widget#element this.element
	* @borrows AjWeb.Widget#parent this.parent
	* @borrows AjWeb.Widget#children this.children
	* 
	* パネルを作成
	* @param {Object} opt 設定オプション
	* @param {String} opt.id ウィジェットID
	* @param {Object} opt.top 親パネル上端からの相対位置
	* @param {Object} opt.left 親パネル左端からの相対位置
	* @param {Object} opt.height 親パネル左端からの相対位置
	* @param {Object} opt.width 親パネル左端からの相対位置
	* @param {Object} opt.onload ロード時に読み込まれる関数
	*/


   constructor: function(opt){
	   this.id = opt.id;
	   this.children = [];
	if(opt.width) this.width = opt.width;
	else this.width = "100%";
	if(opt.height) this.height = opt.height;
	else this.height = "100%";
	if(opt.top) this.top = opt.top;
	else this.top = "0px";
	if(opt.left) this.left = opt.left;
	else this.left = "0px";
	if(opt.color) this.color = opt.color;
	else this.color = "white";
	this.widget = new dijit.layout.ContentPane({
		id : this.id,
		content: "",
			 style: "width: " + this.width + "; height: " + this.height + "; background-color: " + this.color + ";"
			 ,onLoad :function(){ console.log("panel " + this.id + "  onload");}
			 });
		 this.element = this.widget.domNode;
	},
	startup: function(){
	//	alert("panel startup");
		this.widget.startup();
		this.widget.domNode.style.position = "absolute";
		this.widget.domNode.style.width = this.width;
		this.widget.domNode.style.height = this.height;
		this.widget.domNode.style.top = this.top;
		this.widget.domNode.style.left = this.left;
		this.widget.domNode.style.backgroundColor= this.color;

		//子供のstartup()を呼び出する
		for(var i = 0; i < this.children.length; i++){
	//		alert(this.children[i].id  + "  startup");
			this.children[i].startup();
		}
	},
   /**
	* 子ウィジェットを追加
	* @return {boolean} 
	* @param {AjWeb.Widget} 追加するwidget
	*/
   add : function(child) {
	 this.element.appendChild(child.element);
	 this.children.push(child);
	 child.parent = this;
	 return true;
   },
   /**
	* 子ウィジェットを削除
	* @return {boolean} 
	* @param {AjWeb.Widget} 削除するwidget
	*/
   remove : function(child) {
	 for(var i = 0; i < this.children.length; i++){
	   if(this.children[i] == child){
		 this.children[i].element.removeChild();
		 delete this.children[i];
		 this.children.splice(i,1);
		 return true;
	   }
	   return false;
	 }

 },

   /** ロード時に呼び出される関数を保持する配列*/
   onload : [],
   /** ロード時に呼び出される関数を登録*/
   addOnload : function(){
   },
   /** ロード時に呼び出される関数を解除 */
   removeOnload : function(){
   },
   /** デバッグ用メソッド*/
   inspect : function(){
	 return "AjWeb.Panel_" + this.id;
 }
 });

