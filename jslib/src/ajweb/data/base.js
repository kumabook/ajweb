dojo.provide("ajweb.data.base");
dojo.require("ajweb.base");

if(!ajweb.data){
/** @namespace */
  ajweb.data = {};
}


ajweb.data.toJSONConditions = function(){
  var obj = {};

  for(var i = 0; i < ajweb.databases.length; i++){
    obj[ajweb.databases[i].tablename] = [];
    for(var j = 0; j < ajweb.databases[i].conditions.length; j++){
      if(ajweb.databases[i].conditions[j].isContainDatabaseItem()){
//	alert(j + "  " + ajweb.toJSON(ajweb.databases[i].conditions[j]));
	obj[ajweb.databases[i].tablename].push(ajweb.databases[i].conditions[j]);
      }
    }
  }
  return ajweb.toJSON(obj);
};