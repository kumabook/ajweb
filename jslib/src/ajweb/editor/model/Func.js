dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Func");
dojo.require("ajweb.editor.element.DBFunc");

dojo.provide("ajweb.editor.model.Func");
dojo.declare("ajweb.editor.model.Func", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Func.prototype */
 {
   createParam: function(elemName, funcName){
     var model = this.application.getElementByPropId(elemName);
     if(model instanceof ajweb.editor.model.Database){//データベースのスキーマからparamModelを追加
       for(var i = 0; i < model.children.length; i++){
	 if(model.children[i].tagName == "property"){
	   var param = this.editor.createModel("param", 
				   {name: model.children[i].properties.name, 
				    type: model.children[i].properties.type},
				   this,
				   this.element);
	   var value = this.editor.createModel("value",
				   {},
				   param,
				   param.element
				  );
	 }
       }
     }
     else {//funcInfoListから情報を取得して、paramModelを追加
 //      console.log("elemName: " + elemName + "  funcName: " + funcName);
       var name = model.properties.tagName;
       var element, func;
       var i = 0;
       for(i = 0; i < ajweb.editor.FUNCLIST.length; i++){
	 if(name == ajweb.editor.FUNCLIST[i].name)
	   element = ajweb.editor.FUNCLIST[i];
       }
       for(i = 0; i < element.setters.length; i++){
	 if(funcName == element.setters[i].name)
	   func  = element.setters[i];
       }
       for(i = 0; i < func.params.length; i++){
	 var param = this.editor.createModel("param", 
					     {name: func.params[i].key,
					      type: func.params[i].type},
					     this,
					     this.element);
	 var input = func.params[i].input;
	 var value= this.editor.createModel(input ? input.className : "value",
					    input ? {type: input.type, target: model.properties.id} : {},
					    param,
					    param.element
					   );	
       }
     }
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
