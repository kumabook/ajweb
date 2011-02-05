dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Func");
dojo.require("ajweb.editor.element.Primitive");
dojo.require("ajweb.editor.element.DBFunc");

dojo.provide("ajweb.editor.model.Value");
dojo.declare("ajweb.editor.model.Value", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Value.prototype */
 {
   toXMLElement: function(isSave){
     if(isSave)
       return this.inherited(arguments);

     var name = this.properties.element;
     if(!name)
       return this.inherited(arguments);
     else if(name == "int" || name == "string" || name == "date" || 
	     name == "time" || name == "datetime" || name == "password"){
       var node = this.inherited(arguments);
       node.setAttribute("element", "ajweb."+name);
       return node;
     }
     else
       return this.inherited(arguments);
   },

   createParam: function(elemName, funcName, database){
     var i = 0;
     var model = this.application.getElementByPropId(elemName);
     var name = model ? model.properties.tagName : elemName;

     if(name == "receivedItem" || name == "targetItem"){
//       var database = this.application.getElementByPropId(databaseId);

       if(funcName == "property"){
	 var param = this.editor.newModel("param",
					     {name: "property",
					      type: "string"},
					     this,
					     this.element);

	 var value = this.editor.newModel("stringSelect",
					     {type: "data", target: database},
					     param,
					     param.element
					    );
       }
     }
     else {
       var element, func;
       //console.log(name + "  " + funcName);
       var list = ajweb.editor.MODELLIST;
       for(i = 0; i < list.length; i++){
	 if(name == list[i].name)
	   element = list[i];
       }
       if(!element)
	 return;

       for(i = 0; i < element.getters.length; i++){
	 if(funcName == element.getters[i].name)
	   func = element.getters[i];
       }

       for(i = 0; i < func.params.length; i++){
	 var param = this.editor.newModel("param",
					     {name: func.params[i].key,
					      type: func.params[i].type},
					     this,
					     this.element);
	 var input = func.params[i].input;
	 if(input && model){
	   var target = model.properties[func.params[i].input.targetProperty];
	 }
	 var value = this.editor.newModel(input ? input.className : "value",
					     input ?  {type: input.type,target: target ? target
						       : model ? model.properties.id : null} : {},
					     param,
					     param.element
					    );
       }
     }
   },
   clearParam: function(){
     while(this.children.length != 0){
       this.children[0].remove();
     }
   },
   reCreateParamDom: function(){
     for(var i = 0; i < this.children.length; i++){
       this.children[i].createDomRecursive(this.element);
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
   },
   
   validate: function(){
     if(this.properties.element == null || this.properties.func == null){
       this.log("no value");
       return false;
     }
       
     else
       return true;
   }
 }
);
