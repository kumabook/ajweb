/**
 * @ fileOverview sqlユーティリティ
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
//dojo.require("dojox.sql");
dojo.require("ajweb.base");

dojo.provide("ajweb.data.sql");
dojo.declare("ajweb.data.sql", null, {});

//prepared statementに対応させる必要あり

/** @namespace */
ajweb.data.sql = {};
/** @methodOf ajweb.data.sql */
ajweb.data.sql.create = function(tablename, properties){
  var scheme = "(id INTEGER  KEY ";
  for(var i = 0; i < properties.length; i++){
    scheme += ", ";
    scheme += properties[i];
  }
  scheme += ")";
  var SQL = "CREATE TABLE IF NOT EXISTS " + tablename + scheme;
  ajweb.log.trace(SQL);
  //dojox.sql(SQL);
  ajweb.data.sql.exec(SQL);
};
/** @methodOf ajweb.data.sql */
ajweb.data.sql.drop = function(tablename){
  var SQL = "DROP TABLE IF EXISTS " + tablename;
  ajweb.log.trace(SQL);
//  dojox.sql(SQL);
  ajweb.data.sql.exec(SQL);
};

/** @methodOf ajweb.data.sql */
ajweb.data.sql.insert = function(tablename, properties, params){
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
  ajweb.log.trace(SQL);
//  dojox.sql(SQL);
  ajweb.data.sql.exec(SQL);
  return params;
};

/** @methodOf ajweb.data.sql */
ajweb.data.sql.remove = function(tablename, params){
  var id = params;
  if(!(id instanceof Number))
    id = params.id;
  var SQL = "DELETE  FROM " + tablename + " WHERE id='" + id + "'";
  ajweb.log.trace(SQL);
//  dojox.sql(SQL);
  ajweb.data.sql.exec(SQL);
};
/** @methodOf ajweb.data.sql */
ajweb.data.sql.update = function(tablename, properties, params){
  var values_sql = "";
  for(var i = 0; i < properties.length; i++){
    if(i!=0){
      values_sql += ", ";
    }
    values_sql +=  properties[i] + " = '" + params[properties[i]]+ "'";
    }
  values_sql += "";
  var SQL = "UPDATE " + tablename + " SET " + values_sql + " WHERE id = '" + params["id"] + "'";
  ajweb.log.trace(SQL);
//  dojox.sql(SQL);
  ajweb.data.sql.exec(SQL);
};
/** @methodOf ajweb.data.sql */
ajweb.data.sql.select = function(tablename, properties, where, next){
  //conditionをもとに実装
  var SQL = "SELECT * FROM " + tablename; // " WHERE " + properties_sql + " VALUES " + values_sql;
  ajweb.log.trace(SQL);
//  var rs = dojox.sql(SQL);

//  return rs;
  ajweb.data.sql.exec(SQL, next);
};

ajweb.sql = ajweb.data.sql;


ajweb.data.sql.exec = function(SQL, next){
  var db = openDatabase("ajweb_database", "1.0", "ajweb_database_testdb", 1024);
  db.transaction(
    function(tx){
      tx.excuteSql(
      SQL,
	[],
	function onSuccess(tx, resultSet){
	  var results = [];
	  if(next instanceof Function){
	    for(var i = 0; i < resultSet.rows.length; i++){
	      results.push(resultSet.rows.item(i));
	    }
	  }
	  next(results);
	},
	function onError(tx, error){
	}
      );
    },
    function onError(error){
    }
  );
};
  
