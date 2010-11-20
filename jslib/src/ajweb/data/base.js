
dojo.provide("ajweb.data.base");
dojo.require("ajweb.base");


if(!ajweb.data){
/** @namespace */
  ajweb.data = {};
}


ajweb.data.toJSONConditions = function(){
  var obj = {};
  var databases = ajweb.server_databases;
  for(var i = 0; i < databases.length; i++){
    if(databases[i].type == "server"){
      obj[databases[i].tablename] = [];
      for(var j = 0; j < databases[i].conditions.length; j++){
	if(databases[i].conditions[j].isContainDatabaseItem()){
//	alert(j + "  " + ajweb.toJSON(databases[i].conditions[j]));
	obj[databases[i].tablename].push(databases[i].conditions[j]);
	  }
	}
    }
  }
  return ajweb.toJSON(obj);
};

ajweb.data.getDatabaseById = function(id){
  for(var i = 0; i < ajweb.databases[i].length; i++){
    if(ajweb.databases[i].id == id){
      return ajweb.databases[i];
    }
  }
  return null;
};
ajweb.data.login = function(params, next){
  ajweb.send("dbservlet",
	     "users",
	     "login",
	     params,
	     next
  );
};

ajweb.data.String = {};
ajweb.data.String.concat = function(param){
  return param.left + param.right;
};