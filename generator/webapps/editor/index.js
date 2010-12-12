dojo.require("ajweb.editor.Editor");
dojo.addOnLoad(
  function(){
   window.editor = new ajweb.editor.Editor("editor");
    
    dojo.xhrGet({
		  url: "chat.ajml",
		  handleAs: "xml",
		  load: function(data){
		   var ajml =  ajweb.xml.serialize(data);
		    editor.openAjml(ajml);
		  }
		});
//   editor.newApplication("chat");
    
  });
