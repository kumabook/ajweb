dojo.provide("ajweb.widget.Frame");
dojo.require("dijit.layout.StackContainer");
dojo.require("ajweb.widget.Widget");
/**
 * フレームを作成
 *
 * @class panel要素を表示するajframe要素のクラス
 *
 * @param {Object} opt 設定オプション
 * @param {String} opt.id ウィジェットID
 * @param {String} opt.parent 親フレームID
 * @param {String} opt.isRoot ルートかどうか
 * @param {Object} opt.top 親パネル上端からの相対位置
 * @param {Object} opt.left 親パネル左端からの相対位置
 */
dojo.declare("ajweb.widget.Frame", ajweb.widget.Widget, {
	constructor: function(opt){
		this.id = opt.id;

		this.children = [];
//		this.selectChild ;

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
	   this.widget = new dijit.layout.StackContainer({
		   id : this.id,
		   style: "width: " + this.width + "; height: " + this.height + "; background-color: " + this.color + ";"
	   });
	   this.element = this.widget.domNode;
   },
/*   selectPanel: function(panel){

	   this.widget.selectChild(panel.widget);
//	   alert("call select element starup");
	   panel.startup();

   },*/
   startup: function(){
	   this.widget.startup();
	   this.widget.domNode.style.position = "absolute";
	   this.widget.domNode.style.width = this.width;
	   this.widget.domNode.style.height = this.height;
	   this.widget.domNode.style.top = this.top;
	   this.widget.domNode.style.left = this.left;
	   this.widget.domNode.style.backgroundColor= this.color;

		//子供のstartup()を呼び出する
		for(var i = 0; i < this.children.length; i++){
		//	alert(this.children[i].id  + "  startup");
//			this.children[i].startup();
		}
		this.selectChild.startup();
		this.widget.selectChild(this.selectChild.id);
	//	alert(this.selectChild.id);



   },
   add : function(child) {
	   this.element.appendChild(child.element);
	   this.children.push(child);
	   child.parent = this;
	   return true;
   },
   addPanel : function(childPanel){
	   this.widget.addChild(childPanel.widget);
	   this.children.push(childPanel);
   },
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
  setSelectChild : function(child){
	  this.selectChild =child;
  },
  selectPanel : function(params){
	  this.widget.selectChild(params.child.id);
	  this.setSelectChild(params.child);
	  //params.child.startup();
	  this.startup();
  },
  onload : [],
  /** ロード時に呼び出される関数を登録*/
  addOnload : function(){
  },
  /** ロード時に呼び出される関数を解除 */
  removeOnload : function(){
  },

  inspect : function(){
	  return "FrameWidget" + this.id;
  }
});
