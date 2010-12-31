dojo.provide("ajweb.editor.element.Drawable");
dojo.declare("ajweb.editor.element.Drawable", null,
	     {
	       constructor: function(){
		 this.nodes = [];
		 this.lines = [];
		 this.lineContainerNode = this.createLineContainerNode();
	       },
	       lineWidth: "1px",//線の太さ
	       /**
		* lineを格納するコンテナノード
		*/
	       createLineContainerNode: function(){
		 return this.domNode;
	       },
	       draw: function drawLine(start, end, label, color){
		 var startDom, endDom;
		 label = label ? label : "";
		 color = color ? color : "black";

		 if(start.style){
		   startDom = start;
		   start = {};
		   start.x = parseInt(startDom.style.left) + parseInt(startDom.style.width);
		   start.y = parseInt(startDom.style.top) +
		   parseInt(startDom.style.height ? startDom.style.height : "15px")/2;
		 }
		 if(end.style){
		   endDom = end;
		   end = {};
		   end.x = parseInt(endDom.style.left);
		   end.y = parseInt(endDom.style.top) +
		     parseInt(endDom.style.height ? endDom.style.height : "15px")/2;
		 }

		 var objPalatte = document.createElement("div");
		 var labelDom = document.createElement("div");
		 labelDom.style.position = "absolute";
		 labelDom.style.top = (start.y + end.y) / 2 + "px";
		 labelDom.style.left = (start.x + end.x) / 2 + "px";
		 labelDom.innerHTML = label;

		 objPalatte.appendChild(labelDom);

		 if((start.x == end.x) || (start.y == end.y)){
		   var objLine = document.createElement("div");
		   objLine.style.backgroundColor = color;
		   objLine.style.position  = "absolute";
                   objLine.style.overflow  = "hidden";
		   if(start.x == end.x){
                     objLine.style.width = this.lineWidth;
                     objLine.style.height    = Math.abs(end.y-start.y+1);
		   }
		   else {
                     objLine.style.height = this.lineWidth;
                     objLine.style.width     = Math.abs(end.x-start.x+1);
		   }
                   objLine.style.top  = Math.min(start.y,end.y) + "px";
                   objLine.style.left = Math.min(start.x,end.x) + "px";


                  objPalatte.appendChild(objLine);
                 }
                 else if(Math.abs(start.x - end.x) > Math.abs(start.y - end.y)){

                     // |傾き| < 1
                     var A = [start.x, start.y];
                     var B = [end.x, end.y];
                     var P1 = (A[0] > B[0]) ? B : A;    //Xの値の小さいほう
                     var P2 = (A[0] <= B[0]) ? B : A;   //Xの値の大きいほう

                     for(var intX = P1[0]; intX <= P2[0]; intX++){
                       var intY = ((P2[1] - P1[1]) / (P2[0] - P1[0])) * (intX - P1[0]) + P1[1];

                       objPalatte.appendChild(this._drawLine(intX,intY,color));
                     }
                   }
                   else {
                     // |傾き| > 1
                     var A = [start.x, start.y];
                     var B = [end.x, end.y];

                     var P1 = (A[1] > B[1]) ? B : A;    //Yの値の小さいほう
                     var P2 = (A[1] <= B[1]) ? B : A;   //Yの値の大きいほう

                     for(var intY = P1[1]; intY <= P2[1]; intY++){
                       var intX = ((P2[0] - P1[0]) / (P2[1] - P1[1])) * (intY - P1[1]) + P1[0];

                       objPalatte.appendChild(this._drawLine(intX,intY,color));
                     }
                   }
                 return { domNode: objPalatte, start: startDom, end: endDom, label: label, color: color};
                 },

               _drawLine: function(x,y,color){
                   var objPoint = document.createElement("div");
                   objPoint.style.backgroundColor = color;
                   objPoint.style.position  = "absolute";
                   objPoint.style.overflow  = "hidden";
                   objPoint.style.width     = this.lineWidth;
                   objPoint.style.height    = this.lineWidth;
                   objPoint.style.top  = y + "px";
                   objPoint.style.left = x + "px";
                   return objPoint;
               },
	       reDraw: function(line){
/*	       dojo.forEach(this.lines,
		   function(value, i, a){
		     if(a[i] == line){
		       var newLine = this.draw(a[i].start, a[i].end, a[i].label, a[i].color);
		       this.lineContainerNode.replaceChild(newLine.domNode, a[i].domNode);
		       a[i] = newLine;
		   }
		 }, this);*/
		 for(var i = 0; i < this.lines.length; i++){
		   if(this.lines[i] == line){
		     var newLine = this.draw(
		       this.lines[i].start,
		       this.lines[i].end,
		       this.lines[i].label,
		       this.lines[i].color);
		     this.lineContainerNode.replaceChild(newLine.domNode, this.lines[i].domNode);
		     this.lines[i] = newLine;
		   }
		 }
	       },
	       reDrawChildNode: function(childNode){
		 for(var i = 0; i < this.lines.length; i++){
		   if(this.lines[i].start == childNode
		      || this.lines[i].end == childNode){
		     this.reDraw(this.lines[i]);
		   }
		 }
	       },
	       replaceNode: function(oldNode, newNode){
		 var i;
		 for(i = 0; i < this.lines.length; i++){
		   if(this.lines[i].start == oldNode){
		     this.lines[i].start = newNode;
		     this.reDraw(this.lines[i]);
		   }
		 }
		 for(i = 0; i < this.lines.length; i++){
		   if(this.lines[i].end == oldNode){
		     this.lines[i].end = newNode;
		     this.reDraw(this.lines[i]);
		   }
		 }
	       },
	       /**
		* あるノードを取り除いて、関連するエッジも取り除く。つなぎ替えも行う。
		*/
	       removeNode: function(node){
		 for(var i = 0; i < this.lines.length; i++){
		   if(this.lines[i].end == node){
		     if(i==this.lines.length-1){//最後のノードなら取り除くだけ
		       this.lineContainerNode.removeChild(this.lines[i].domNode);
		       this.lines.splice(i,1);
		     }
		     else {
		       for(var j = 0; j < this.lines.length; j++){//つなぎかえを行う
			 if(this.lines[j].start == node){
			   this.lines[j].start = this.lines[i].start;

			   this.lines[j].end.style.top = this.lines[i].end.style.top;
			   this.lines[j].end.style.left = this.lines[i].end.style.left;

			   this.lineContainerNode.removeChild(this.lines[i].domNode);
			   this.reDraw(this.lines[j]);
			   this.lines.splice(i,1);
			 }
		       }
		     }
		   }
		 }
	       },
	       startup: function(){
		 this.inherited(arguments);
	       }
});
