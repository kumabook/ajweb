dojo.provide("ajweb.editor.gridCellEdit");
var dgc = dojox.grid.cells;
dojo.declare("ajweb.editor.gridCellEdit", dgc.Cell, {
	       options: null,
	       
	       // values: Array
	       //		value for each item
	       values: null,
	       
	       // returnIndex: Integer
	       // 		editor returns only the index of the selected option and not the value
	       returnIndex: -1,
	       
	       constructor: function(inCell){
		 this.values = this.values || this.options;
	       },
	       formatEditing: function(inDatum, inRowIndex){
		 var property = this.getProperty(inRowIndex);

		 if(property.type == "select"){
		   //var options = [], values = [];
		   this.options = []; this.values = [];
		   var databases = this.store.currentModel.application.getDatabasesModel();
		   var j;
		   for(j = 0; j < databases.children.length; j++){
		     this.options.push(databases.children[j].properties.id);
		     this.values.push(databases.children[j].properties.id);
		   }
		   this.needFormatNode(inDatum, inRowIndex);

		   var h = [ '<select class="dojoxGridSelect">' ];
		   for (var i=0, o, v; ((o=this.options[i]) !== undefined)&&((v=this.values[i]) !== undefined); i++){
		     h.push("<option", (inDatum==v ? ' selected' : ''), ' value="' + v + '"', ">", o, "</option>");
		   }
		   h.push('</select>');
		   return h.join('');
		 }
		 else 
		   return this.inherited(arguments);
	       },
	       getValue: function(inRowIndex){
		 var property = this.getProperty(inRowIndex);
		 if(property.type == "select"){
		   var n = this.getEditNode(inRowIndex);
		   if(n){
		     var i = n.selectedIndex, o = n.options[i];
		     return this.returnIndex > -1 ? i : o.value || o.innerHTML;
		   }
		   return null;
		 } 
		 else {
		   return this.inherited(arguments);
		 }
	       },
	       getProperty: function(inRowIndex){
		 var property = this.store.currentModel.propertyList[inRowIndex];
		 var propertyName, propertyType;
		 if(typeof property == "string"){
		   return {name: property, type: "text"};
		 }
		 else {
		   return {name: property.name, type: property.type};
		 }
	       }
	     });
