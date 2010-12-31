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
	       reDraw: function(){
		 dojo.forEach(this.lines,
		   function(v, i, a){
		     this.reDrawLine(v);
		   },
		   this);
	       },
	       reDrawLine: function(line){
		 dojo.forEach(this.lines,
		   function(v, i, a){
		     if(v == line){
		       var newLine = this.draw(v.start, v.end, v.label, v.color);
		       this.lineContainerNode.replaceChild(newLine.domNode, v.domNode);
		       a[i] = newLine;
		     }
		   }, this);
	       },
	       reDrawChildNode: function(childNode){
		 dojo.forEach(this.lines,
		   function(v, i ,a){
		     if(v.start == childNode || v.end == childNode){
		       this.reDrawLine(v);
		     }
		   }, this);
	       },
	       replaceNode: function(oldNode, newNode){
		 dojo.forEach(this.lines,
		   function(v, i ,a){
		     if(v.start == oldNode){
		       v.start = newNode;
		       this.reDrawLine(v);
		     }
		   }, this);
		 dojo.forEach(this.lines,
		   function(v, i ,a){
		     if(v.end == oldNode){
		       v.end = newNode;
		       this.reDrawLine(v);
		     }
		   }, this);
	       },
	       /**
		* あるノードを取り除いて、関連するエッジも取り除く。つなぎ替えも行う。
		*/
	       removeNode: function(node){
		 this.lines =
		   dojo.filter(this.lines,
		   function(v, i ,a){
		     if(v.end == node){
		       if(i==a.length-1){//最後のノードなら取り除くだけ
			 this.lineContainerNode.removeChild(v.domNode);
			 return false;
		       }
		       else {
			 for(var j = 0; j < a.length; j++){//つなぎかえを行う
			   if(a[j].start == node){
			     a[j].start = v.start;
			     a[j].end.style.top = v.end.style.top;
			     a[j].end.style.left = v.end.style.left;
			     this.lineContainerNode.removeChild(v.domNode);
			     return false;
			   }
			 }
		       }
		     }
		     return true;
		   }, this);
		 this.reDraw();
	       },
	       startup: function(){
		 this.inherited(arguments);
	       }
});
