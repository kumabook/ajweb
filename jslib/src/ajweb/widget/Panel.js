/**
 * @fileOverview 画面を記述するファイル
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.widget.Panel");
dojo.require("dijit.layout.ContentPane");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Panel",
	     ajweb.widget.Widget,
/** @lends ajweb.widget.Panel.prototype */
 {
   /**
    * @constructs
    * @extends ajweb.widget.Widget
    * @borrows ajweb.widget.Widget#id as this.id
    * @borrows ajweb.widget.Widget#element as this.element
    * @borrows ajweb.widget.Widget#parent as this.parent
    * @borrows ajweb.widget.Widget#children as this.children
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
   },
   createWidget: function(){

     this.widget = new dijit.layout.ContentPane({
		     id : this.id,
		     content: "",
		     style: {
		       width: parseInt(this.width)+"px",
		       height: parseInt(this.height)+"px",
		       scroll: "auto",
		       backgroundColor: this.color
		     }
     });
     this.element = this.widget.domNode;
   },
   display: function(){
     this.widget.startup();
     this.onDisplay();
     //子供のstartup()を呼び出する
     for(var i = 0; i < this.children.length; i++){
       this.children[i].display();
     }
   },
   /**
	* 子ウィジェットを追加
	* @return {boolean}
	* @param {AjWeb.Widget} 追加するwidget
	*/
   addChildWidget : function(child) {
	 this.element.appendChild(child.element);
	 this.children.push(child);
	 child.parent = this;
	 return true;
   },
   /**
	* 子ウィジェットを削除
	* @return {boolean}
	* @param {ajWeb.widget._widget} 削除するwidget
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
   onDisplay: function(){
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
	 return "ajWeb.widget.Panel_" + this.id;
 }
 });

