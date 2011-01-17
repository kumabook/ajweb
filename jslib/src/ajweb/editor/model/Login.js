dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Login");

dojo.provide("ajweb.editor.model.Login");
dojo.declare("ajweb.editor.model.Login", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Func.prototype */
 {
   createParam: function(elemName, funcName){
     var paramUser = this.editor.newModel("param",
					     {name: "user_id",
					      type: "string"},
					     this,
					     this.element);
     var valueUser = this.editor.newModel("value",
					     {},
					     paramUser,
					     paramUser.element
					    );
     var paramPass = this.editor.newModel("param",
					     {name: "password",
					      type: "password"},
					     this,
					     this.element);
     var valuePass = this.editor.newModel("value",
					     {},
					     paramPass,
					     paramPass.element
					    );
   },
   clearParam: function(){
     while(this.children.length > 0)
       this.children[0].remove();
   },
   reCreateParamDom: function(){
     for(var i = 0; i < this.children.length; i++){
       this.children[i].reCreateDom(this.element);
       this.children[i].startup();
     }
   },
   removeParamDom: function(){
     for(var i = 0; i < this.children.length; i++){
       this.children[i].removeDom();
     }
   },
   removeParam: function(){
     while(this.children.length != 0)
       this.children[0].remove();
   }
 }
);
