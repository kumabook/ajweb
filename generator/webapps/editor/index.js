dojo.require("ajweb.editor.Editor");
dojo.addOnLoad(
  function(){
   window.editor = new ajweb.editor.Editor("editor");

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