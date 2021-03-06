dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Action");

dojo.provide("ajweb.editor.model.Action");
dojo.declare("ajweb.editor.model.Action", ajweb.editor.model.Visible,
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
