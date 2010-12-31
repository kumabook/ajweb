dojo.require("ajweb.editor.model.Visible");

dojo.provide("ajweb.editor.model.Branch");
dojo.declare("ajweb.editor.model.Branch", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Action.prototype */
 {
   /**
    * アクション以下のcontainerはevent要素
    */
   reCreateDom: function(container){
     this.element = this.createDom(container);
     for(var i = 0; i < this.children.length; i++){
 /*      if(this.children[i].tagName == "condition")
	 this.children[i].reCreateDom(this.element);
       else */
	 this.children[i].reCreateDom(container);
     }
   }
 }
);
