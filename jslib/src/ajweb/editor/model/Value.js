dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Func");
dojo.require("ajweb.editor.element.DBFunc");

dojo.provide("ajweb.editor.model.Value");
dojo.declare("ajweb.editor.model.Value", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Value.prototype */
 {
   createParam: function(elemName, funcName){
     var model = ajweb.getModelById(elemName);
     if(model instanceof ajweb.editor.model.Database){//データベースのスキーマからparamModelを追加
       for(var i = 0; i < model.children.length; i++){
	 if(model.children[i].tagName == "property"){
	   this.editor.createModel("param", 
				   {name: model.children[i].properties.name, 
				    type: model.children[i].properties.type},
				   this,
				   this.element);
	 }
       }
     }
     else {//funcInfoListから情報を取得して、paramModelを追加
     }
   },
   reCreateParamDom: function(){
     for(var i = 0; i < this.children.length; i++){
       this.children[i].reCreateDom(this.element);
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
