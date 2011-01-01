dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Action");

dojo.provide("ajweb.editor.model.Action");
dojo.declare("ajweb.editor.model.Action", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Action.prototype */
 {
   /**
    * アクション以下のcontainerはevent要素
    */
   reCreateDom: function(container){
     this.element = this.createDom(container);
     for(var i = 0; i < this.children.length; i++){
       this.children[i].reCreateDom(container);
     }
   }
 }
);
