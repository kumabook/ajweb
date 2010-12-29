dojo.require("ajweb.editor.model.Visible");
dojo.require("ajweb.editor.element.Func");
dojo.require("ajweb.editor.element.Primitive");
dojo.require("ajweb.editor.element.DBFunc");

dojo.provide("ajweb.editor.model.Value");
dojo.declare("ajweb.editor.model.Value", ajweb.editor.model.Visible,
  /** @lends ajweb.editor.model.Value.prototype */
 {
   toXMLElement: function(xml){
     var name = this.properties.element;
     if(!name)
       return this.inherited(arguments);
     if(name.match("([0-9a-z]+):(targetItem|receivedItem)")){
       this.tagName = name.match("([0-9a-z]+):(targetItem|receivedItem)")[2];

       var node = this.inherited(arguments);
       for(var i = 0; i < node.childNodes.length; i++){
	 node.removeChild(node.childNodes[i]);	 
       }
       node.removeAttribute("type");
       node.removeAttribute("element");
       node.removeAttribute("func");
       var property;
       if(this.properties.funcName == "property" && this.children[0].children[0]){
	 property = this.children[0].children[0].properties._character;
	 node.setAttribute("property", property);
       }
       this.tagName = "value";
       return node;
     }
     else 
       return this.inherited(arguments);
   },

   createParam: function(elemName, funcName){
     var i = 0;
     var model = this.application.getElementByPropId(elemName);
     var name = model ? model.properties.tagName : elemName;

     if(name.match("([0-9a-z]+):(targetItem|receivedItem)")){
       var database = name.match("([0-9a-z]+):(targetItem|receivedItem)")[1];
       
       if(funcName == "property"){
	 var param = this.editor.createModel("param", 
					     {name: "property",
					      type: "string"},
					     this,
					     this.element);

	 var value = this.editor.createModel("stringSelect",
					     {type: "data", target: database},
					     param,
					     param.element
					    );	
       }
     }
     else {
       var element, func;

       for(i = 0; i < ajweb.editor.FUNCLIST.length; i++){
	 if(name == ajweb.editor.FUNCLIST[i].name)
	   element = ajweb.editor.FUNCLIST[i];
       }
       
       if(!element)
	 return;
       
       for(i = 0; i < element.getters.length; i++){
	 if(funcName == element.getters[i].name)
	   func = element.getters[i];
       }

       for(i = 0; i < func.params.length; i++){
	 var param = this.editor.createModel("param", 
					     {name: func.params[i].key,
					      type: func.params[i].type},
					     this,
					     this.element);
	 var input = func.params[i].input;
	 if(input && model){
	   var target = model.properties[func.params[i].input.targetProperty];
	 }
	 var value = this.editor.createModel(input ? input.className : "value",
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
