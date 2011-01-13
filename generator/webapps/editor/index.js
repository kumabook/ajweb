ajweb = { locale:"en"};
dojo.config["useXDomain"] = true;
dojo.require("ajweb.editor.Editor");
dojo.addOnLoad(
  function(){
   window.editor = new ajweb.editor.Editor("editor", "generate", "upload");
    var url = new String(window.location);
    var query = new Array();
    var ajml_url;
    query = url.split("?");
    if ( !!query[1] ) {
      ajml_url = query[1].split("=")[1];
    }
    if(ajml_url)
      dojo.xhrGet({
		    url: ajml_url,//"chat.ajml",
		    handleAs: "xml",
		    load: function(data){
		      var ajml =  ajweb.xml.serialize(data);
		      editor.openAjml(ajml);
		    }
		  });
//   editor.newApplication("chat");
    
  });
