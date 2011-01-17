dojo.require("ajweb.editor.model.Visible");

dojo.provide("ajweb.editor.model.Branch");
dojo.declare("ajweb.editor.model.Branch", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Action.prototype */
 {
   /**
    * アクション以下のcontainerはevent要素
    */
   createDomRecursive: function(container){
     this.createDom(container);
     this.createDomDescendants(container);
   }
 }
);
