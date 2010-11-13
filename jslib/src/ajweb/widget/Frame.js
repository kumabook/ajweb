dojo.provide("ajweb.widget.Frame");
dojo.require("dijit.layout.StackContainer");
dojo.require("ajweb.widget.Widget");

dojo.declare("ajweb.widget.Frame", ajweb.widget.Widget, {
	constructor: function(opt){

   },
   createWidget: function(){
     this.widget = new dijit.layout.StackContainer({
       id : this.id,
       style: "width: " + this.width + "; height: " + this.height + "; background-color: " + this.color + ";"
	 });
       this.element = this.widget.domNode;
   },

   startup: function(){
	   this.widget.startup();
	   this.widget.domNode.style.position = "absolute";
	   this.widget.domNode.style.width = this.width;
	   this.widget.domNode.style.height = this.height;
	   this.widget.domNode.style.top = this.top;
	   this.widget.domNode.style.left = this.left;
	   this.widget.domNode.style.backgroundColor= this.color;

     //子供のstartup()を呼び出しする
//     for(var i = 0; i < this.children.length; i++){
       //	alert(this.children[i].id  + "  startup");
  //     this.children[i].startup();
//     }
//		this.selectChild.startup();
	//	this.widget.selectChild(this.selectChild.id);
	//	alert(this.selectChild.id);



   },
   addChildWidget : function(child) {
	   this.element.appendChild(child.element);
	   this.children.push(child);
	   child.parent = this;
	   return true;
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
//    var id = params.child;
    var child = params.child;
    this.widget.selectChild(child.widget);
    this.setSelectChild(child);
    child.startup();
//	  this.startup();
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
