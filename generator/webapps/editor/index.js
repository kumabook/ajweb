//**********クエリからの初期設定*********
var url = new String(window.location);
var urlArray = url.split("?");
var query_str = !!urlArray[1] ? urlArray[1] : "";
var query =  dojo.queryToObject(query_str);  
//query["locale"] = query["locale"] ? query["locale"] : "en";
if(window.ajweb)
  ajweb.locale = query["locale"] != "ja" ? "" : "ja";
else
  ajweb = {locale : query["locale"] != "ja" ? "" : "ja"};
dojo.config["locale"] = ajweb.locale;
dojo.locale = ajweb.locale;

if(url.match("index.html.*"));
  dojo.config["useXDomain"] = true;  
//**********クエリからの初期設定*********


dojo.require("ajweb.editor.Editor");
//var query = ajweb.editor.getQuery();

dojo.addOnLoad(
  function(){
   window.editor = new ajweb.editor.Editor("editor", "generate", "upload");

    if(query["ajml"])
      dojo.xhrGet({
		    url: query["ajml"],
		    handleAs: "xml",
		    load: function(data){
		      var ajml =  ajweb.xml.serialize(data);
		      editor.openAjml(ajml);
		    }
		  });
  });
