dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Func");
dojo.require("ajweb.editor.element.Primitive");
dojo.require("ajweb.editor.element.DBFunc");

dojo.provide("ajweb.editor.model.Value");
dojo.declare("ajweb.editor.model.Value", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Value.prototype */
 {
   createParam: function(elemName, funcName){
     var model = ajweb.getModelById(elemName);
     
     console.log("elemName: " + elemName + "  funcName: " + funcName);
     var name = model ? model.properties.tagName : elemName;
     var element, func;
     var i = 0;
     for(i = 0; i < ajweb.editor.FUNCLIST.length; i++){
       if(name == ajweb.editor.FUNCLIST[i].name)
	 element = ajweb.editor.FUNCLIST[i];
     }
     
     if(!element)
       return;
     
     for(i = 0; i < element.getters.length; i++){
       if(funcName == element.getters[i].name)
	 func  = element.getters[i];
     }
     
     for(i = 0; i < func.params.length; i++){
       var param = this.editor.createModel("param", 
					   {name: func.params[i].key,
					    type: func.params[i].type},
					   this,
					   this.element);
       var value = this.editor.createModel(func.params[i].input ? name : "value",
					   {},
					   param,
					   param.element
					  );	
     }
   },
   clearParam: function(){
     while(this.children.length != 0)
       this.children[0].remove();
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
