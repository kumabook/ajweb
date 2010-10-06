dojo.require("dojox.sql");
dojo.require("ajweb");
dojo.provide("ajweb.sql");
dojo.declare("ajweb.sql", null, {});
//ajweb.sql = {};
//ajweb = {};
ajweb.sql = {};
ajweb.sql.create = function(tablename, properties){
  var scheme = "(id INTEGER PRIMARY KEY ";
  for(var i = 0; i < properties.length; i++){
    scheme += ", ";
    scheme += properties[i];
  }
  scheme += ")";
  var SQL = "CREATE TABLE IF NOT EXISTS " + tablename + scheme;
  console.log(SQL);
  dojox.sql(SQL);
};

ajweb.sql.drop = function(tablename){
  var SQL = "DROP TABLE IF EXISTS " + tablename;
  console.log(SQL);
  dojox.sql(SQL);
};


ajweb.sql.insert = function(tablename, properties, params){
  var properties_sql = "(";
  var values_sql = "(";
  if(!params.id)
    params.id = Math.floor(Math.random()*100000);
  properties.push("id");
  for(var i = 0; i < properties.length; i++){
    if(params[properties[i]]){
      if(i!=0){
	properties_sql += ", ";
	values_sql += ", ";
      }
      properties_sql += properties[i];
      values_sql += "'" + params[properties[i]]+ "'";
    }
  }
  properties.pop();
  properties_sql += ")";
  values_sql += ")";
  var SQL = "INSERT INTO " + tablename + " " + properties_sql + " VALUES " + values_sql;
  console.log(SQL);
  dojox.sql(SQL);

  return params;
};


ajweb.sql.remove = function(tablename, params){
  var id = params;
  if(!(id instanceof Number))
    id = params.id;
  var SQL = "DELETE  FROM " + tablename + " WHERE id='" + id + "'";
  console.log(SQL);
  dojox.sql(SQL);
};

ajweb.sql.update = function(tablename, properties, params){
  var values_sql = "";
  for(var i = 0; i < properties.length; i++){
    if(i!=0){
      values_sql += ", ";
    }
    values_sql +=  properties[i] + " = '" + params[properties[i]]+ "'";
    }
  values_sql += "";
  var SQL = "UPDATE " + tablename + " SET " + values_sql + " WHERE id = '" + params["id"] + "'";
  console.log(SQL);
  dojox.sql(SQL);  
};

ajweb.sql.select = function(tablename, properties, where){
  var SQL = "SELECT * FROM " + tablename; // " WHERE " + properties_sql + " VALUES " + values_sql;
  console.log(SQL);
  var rs = dojox.sql(SQL);
  return rs;
};
