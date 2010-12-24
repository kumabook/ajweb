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
		 var propertyName = this.store.currentModel.propertyList[inRowIndex];
		 console.log(inDatum + ": " + inRowIndex +  ": "
			     + this.store.currentModel.properties[propertyName]);

		 return this.inherited(arguments);
	
		 this.needFormatNode(inDatum, inRowIndex);
		 var h = [ '<select class="dojoxGridSelect">' ];
		 for (var i=0, o, v; ((o=this.options[i]) !== undefined)&&((v=this.values[i]) !== undefined); i++){
		   h.push("<option", (inDatum==v ? ' selected' : ''), ' value="' + v + '"', ">", o, "</option>");
		 }
		 h.push('</select>');
		 return h.join('');
	       },
	       getValue: function(inRowIndex){
		 return this.inherited(arguments);
		 var n = this.getEditNode(inRowIndex);
		 if(n){
		   var i = n.selectedIndex, o = n.options[i];
		   return this.returnIndex > -1 ? i : o.value || o.innerHTML;
		 }
		 return null;
	       }
	     });
