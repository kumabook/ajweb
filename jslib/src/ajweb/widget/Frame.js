dojo.provide("ajweb.widget.Frame");
dojo.require("dijit.layout.StackContainer");
dojo.require("ajweb.widget.Widget");

dojo.declare("ajweb.widget.Frame", ajweb.widget.Widget, {
	constructor: function(opt){

   },
   createWidget: function(){
     this.widget = new dijit.layout.StackContainer({
       id : this.id,
       style: {
	 position: "absolute",
	 top: parseInt(this.top)+"px",
	 left: parseInt(this.left)+"px",
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
   },
   onDisplay: function(){
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

  selectPanel : function(params){
    this.selectedPanel= params.panel;
    this.widget.selectChild(this.selectedPanel.widget);
    this.selectedPanel.display();
  },
  getSelectedPanel : function(){
    return this.selectedPanel;
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
