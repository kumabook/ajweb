dojo.provide("ajweb.editor.element.Drawable");
dojo.declare("ajweb.editor.element.Drawable", null,
	     {
	       constructor: function(){
		 this.nodes = [];
		 this.lines = [];
	       },
	       lineWidth: "1px",//線の太さ
	       
	       draw: function drawLine(start, end ,color){
		 var startDom, endDom;
		 if(!color) color = "black";
		 if(start.style){
		   startDom = start;
		   start = {};
		   start.x = parseInt(startDom.style.left) + parseInt(startDom.style.width);
		   start.y = parseInt(startDom.style.top) + parseInt(startDom.style.height)/2;
		 }
		 if(end.style){
		   endDom = end;
		   end = {};
		   end.x = parseInt(endDom.style.left);
		   end.y = parseInt(endDom.style.top) + parseInt(endDom.style.height)/2;
		 }
		 
		 this.objPalatte = document.createElement("div");

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
                   this.objPalatte.appendChild(objLine);
                 }
                 else if(Math.abs(start.x - end.x) > Math.abs(start.y - end.y)){
                       
                     // |傾き| < 1
                     var A = [start.x, start.y];
                     var B = [end.x, end.y];
                     var P1 = (A[0] > B[0]) ? B : A;    //Xの値の小さいほう
                     var P2 = (A[0] <= B[0]) ? B : A;   //Xの値の大きいほう

                     for(var intX = P1[0]; intX <= P2[0]; intX++){
                       var intY = ((P2[1] - P1[1]) / (P2[0] - P1[0])) * (intX - P1[0]) + P1[1];

                       this.objPalatte.appendChild(this._drawLine(intX,intY,color));
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

                       this.objPalatte.appendChild(this._drawLine(intX,intY,color));
                     }
                   }
//		 this.lines.push({domNode: this.objPalatte, start: "", end: ""});
                 return { domNode: this.objPalatte, start: startDom, end: endDom };
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
	       startup: function(){
		 this.inherited(arguments);
	       }
});
