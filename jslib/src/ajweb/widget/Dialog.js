dojo.provide("ajweb.widget.Dialog");
dojo.require("dijit.Dialog");
dojo.require("ajweb.widget.Widget");
dojo.declare("ajweb.widget.Dialog",ajweb.widget.Widget,
/** @lends ajweb.widget.Dialog.prototype */ 
 {
   /**
    * @constructs 
    * @extends ajweb.widget.Widget
    * @borrows ajweb.widget.Widget#id this.id
    * @borrows ajweb.widget.Widget#top this.top
    * @borrows ajweb.widget.Widget#left this.left
    * @borrows ajweb.widget.Widget#element this.element
    * @borrows ajweb.widget.Widget#parent this.parent
    * @borrows ajweb.widget.Widget#children this.children
    
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
	   this.content = opt.content;
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
	this.widget = new dijit.Dialog({
		id : this.id,
		content: opt.content,
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
 show: function(){

	this.onShow();
	this.element.show();
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
	 return "ajWeb.widget.Dialog_" + this.id;
 }
 });
