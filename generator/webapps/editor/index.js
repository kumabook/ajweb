dojo.require("ajweb.widget.Button");
dojo.require("ajweb.editor.ModelEditor");
dojo.addOnLoad(
  function(){

    ajweb.xml = {};
    ajweb.xml.serialize = function(node){
      if(typeof XMLSerializer != "undefined")
	return (new XMLSerializer()).serializeToString(node);
      else if (node.xml) return node.xml;
      else throw "XML.serialize is not supported or can't serialize " + node;
    };
   ajweb.editor.modelEditor = new ajweb.editor.ModelEditor("ui", "ajmlEditor", "menu");


  });


/*function draw() {
  var canvas = document.getElementById('canvassample');
  if(!canvas || !canvas.getContext) {
    alert("canvas not supported");
    return false;
  }

  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(20, 20);
  ctx.lineTo(120, 20);
  ctx.lineTo(120, 120);
  ctx.lineTo(20, 120);
  ctx.closePath();
  ctx.stroke();
  return true;
  ctx.beginPath();
  ctx.moveTo(20, 20);
  ctx.lineTo(120,20);

  ctx.stroke();


}*/