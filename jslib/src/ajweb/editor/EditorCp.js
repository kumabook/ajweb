dojo.provide("ajweb.editor.EditorCp");
dojo.require("dojox.gfx");
dojo.declare("ajweb.editor.EditorCp", null, 
	     {
	       constructor : function(opt){
		 this.id = opt.id;
		 this.title = opt.title;
		 this.children = [];
		 this.lines = [];
		 this.properties = {};
		 this.propertyList = opt.propertyList;
		 this.tagName = opt.tagName;
		 this.acceptComponentType = opt.acceptComponentType;

		 var that = this;
		 this.create();

		 this.element = this.widget.domNode;
//		 this.widget.domNode.appendChild(this.canvas);
//		 this.draw( {x:10, y:10}, {x:100, y:120}, "black");

	       },
	       create: function(){
		 this.widget = new dijit.layout.ContentPane(
		   {
		     id : this.id,
		     title: this.title,
		     region: "center",
		     doLayout: false
		   }
		 );

		 
	       },
	       startup : function(){
		 this.widget.startup();

/*		 for(var i = 0; i < this.children.length; i++){
		   this.children[i].startup();
		 }*/
		 this.dndEnable();
		 console.log("construtor checkAcceptance  " + this.id + "  "  + ajweb.toJSON(this.acceptComponentType));
	       },
	       dndEnable : function(){
		 var that = this;
		 var widget = this.widget;
		 this.dndwidget = new dojo.dnd.Source(
		   this.id, 
		   {
		     accept: ["text", "treeNode"],
		     checkAcceptance : function(source, nodes){
		       console.log("checkAcceptance  " + that.id + "  " + ajweb.toJSON(that.acceptComponentType));
		       var widgetName = nodes[0].childNodes[2].childNodes[2].innerHTML;
		       var widgetType = ajweb.editor.getComponentType(widgetName);

		       if (ajweb.contains(that.acceptComponentType, widgetType)){
			 return true;
		       }
		       return false;
		     },
		     onDrop: function(sources, nodes, copy){

		       var componentName = nodes[0].childNodes[2].childNodes[2].innerHTML;
		       var component = ajweb.editor.getComponent(componentName);
		       var newModel = ajweb.editor.createModel(component, widget.domNode);
		       newModel.ajmlProp = {}; // ajmlの属性を保存
		       that.children.push(newModel);
		       //uiBuilderに配置
		       widget.domNode.appendChild(newModel.element);
		       newModel.startup();
		       //property view を更新
		       newModel.propertiesViewUpdate();
		       //event view を更新
		     }
		   });
	       },
	       dndDisable: function(){
		 if(this.dndWidget)
		   this.dndWidget.destroy();
	       },
	       checkAcceptance: function(widgetType){
		 for(var i = 0; i < this.acceptComponentType.length; i++){
		  if(this.acceptComponentType[i] == widgetType)
		    return true;
		 }
		 return false;
	       },
	       getXMLElement: function(xml){

		 var node =  xml.createElement(this.tagName);
		 for(var i = 0; i < this.propertyList.length; i++){
		   node.setAttribute(this.propertyList[i], this.properties[this.propertyList[i]]);
		 }

		 for(i = 0; i < this.children.length; i++){
		   node.appendChild(this.children[i].getXMLElement(xml));
		 }
		 return node;
	       },
	       draw: function drawLine(start, end ,color){

		   var strW = "1px";//線の太さ
		   var strH = "1px";//線の太さ
		   var returnArray = [];
		   this.objPalatte = document.createElement("div");

		   if((start.x == end.x) || (start.y == end.y)){
		     var objLine = document.createElement("div");
		     var strColor = color;
		     objLine.stylebackgroundColor = strColor;
		     objLine.style.position  = "absolute";
		     objLine.style.overflow  = "hidden";
		     objLine.style.width     = Math.abs(end.x-start.x+1);
		     objLine.style.height    = Math.abs(end.y-start.y+1);
		     objLine.style.top  = Math.min(start.y,end.y) + "px";
		     objLine.style.left = Math.min(start.x,end.x) + "px";
		     
		     this.objPalatte.appendChild(objLine);
		   }
		   else if(Math.abs(start.x - end.x) > Math.abs(start.y - end.y)){
		       
		     // |傾き| < 1
		     var A = [start.x, start.y];
		     var B = [end.x, end.y];
		     var P1 = (A[0] > B[0]) ? B : A;	//Xの値の小さいほう
		     var P2 = (A[0] <= B[0]) ? B : A;	//Xの値の大きいほう

		     for(var intX = P1[0]; intX <= P2[0]; intX++){
		       var intY = ((P2[1] - P1[1]) / (P2[0] - P1[0])) * (intX - P1[0]) + P1[1];

		       this.objPalatte.appendChild(this._drawLine(intX,intY,color));
		     }
		   }
		   else {
		     // |傾き| > 1
		     var A = [start.x, start.y];
		     var B = [end.x, end.y];

		     var P1 = (A[1] > B[1]) ? B : A;	//Yの値の小さいほう
		     var P2 = (A[1] <= B[1]) ? B : A;	//Yの値の大きいほう

		     for(var intY = P1[1]; intY <= P2[1]; intY++){
		       var intX = ((P2[0] - P1[0]) / (P2[1] - P1[1])) * (intY - P1[1]) + P1[0];

		       this.objPalatte.appendChild(this._drawLine(intX,intY,color));
		     }
		   }
		   return this.widget.domNode.appendChild(this.objPalatte);
		 },

	       _drawLine: function(x,y,color){
		   var strColor = color;	//線の色
		   var strW = "1px";//線の太さ
		   var strH = "1px";//線の太さ

		   var objPoint = document.createElement("div");

		   objPoint.style.backgroundColor = strColor;
		   objPoint.style.position  = "absolute";
		   objPoint.style.overflow  = "hidden";
		   objPoint.style.width     = strW;
		   objPoint.style.height    = strH;
		   objPoint.style.top  = y + "px";
		   objPoint.style.left = x + "px";

		   return objPoint;
	       }


/*		 var ctx = this.canvas.getContext('2d');
		 ctx.beginPath();
		 ctx.lineWidth = "1px";
		 ctx.moveTo(start.x, start.y);
		 ctx.lineTo(end.x, end.y);
		 ctx.closePath();
		 ctx.stroke();
//		 this.*/


	     }
);
