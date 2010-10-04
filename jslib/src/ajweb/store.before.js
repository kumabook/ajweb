dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.sql");

dojo.declare("ajweb.data.Store", null,
{

	constructor : function(opt){
	  this.url = opt.url;
	  this.tablename = opt.tablename;
	  this.properties = opt.properties;
	  this.param = opt.param;//condition
///web storage を使おう
	  //	this.store = new dojo.data.ItemFileWriteStore({ url: this.url + "?action=select&table=" + this.table + "&param=" + dojo.toJson(this.param)});

	  this.store = new dojo.data.ItemFileWriteStore({ data: {  items: []}});
	  
	  
	//  this.select();
		this.id = opt.id;
	},
        create : function() {
	  var scheme = "(";
	  for(var i = 0; i < this.properties.length; i++){
            scheme += this.properties[i];
	    if(i!=this.properties.length-1)
	      scheme += ", ";
	    else
	      scheme += ")";
	  }
	  var SQL = "CREATE TABLE IF NOT EXISTS " + this.tablename + scheme;
	  console.log(SQL);
	  dojox.sql(SQL);
	},
	fetch : function(){//読み込みなおし、clearとselect
	  
	},

	insert: function(params){
	  var properties_sql = "(";
	  var values_sql = "(";
	  for(var i = 0; i < this.properties.length; i++){
            properties_sql += this.properties[i];
	    if(i!=this.properties.length-1){
	      properties_sql += ", ";
	      values_sql += "'" + params[properties[i]]+ "'";
	    }
	    else{
	      properties_sql += ")";
	      values_sql += ")";
	    }
	  }
	  var SQL = "INSERT INTO " + this.tablename + " " + properties_sql + " VALUES " + values_sql;
	  console.log(SQL);
	  dojox.sql(SQL);
	},


	update: function(params){
	},

	select: function(){
//	  alert("select");
	  this.clear();
//	  alert("clear");
	  var store = this.store;
	  if(navigator.onLine){//onlineなら外部と通信
	    dojo.xhrPost({url :this.url, handleAs: "json", content : { table: this.table, action: "select", param: dojo.toJson(this.param)}

			  ,load : function(data, ioargs){//ローカルのデータベースに保存，dojoストアに反映、
			  //			    alert(dojo.toJson(data));
					for(var i = 0; i < data.items.length; i++){
						//dojo.forEach(data.items, function(value, index){
					   alert("insert" + dojo.toJson(data.items[i]));
	//				  alert("insert   " + data.items[i].user_name + "  " +  data.items[i].id);
					   store.newItem(data.items[i]);

					}
			  }
			 });
	  } else {//offlineなら通知して，ローカルのデータベースから取得
	    
	  }
	  
	},
	
	clear: function(){
	  var store = this.store;
	  store.fetch({ onComplete: function(items, request){
			     for(var i = 0; i < items.length; i++){
			       store.deleteItem(items[i]);
			     //  alert("delete");
			      }
			  }
		  }
	  );
	},
	/**
	 * inspectメソッド：デバッグ情報を出力
	 * @return {String} デバッグ用出力
	 *
	 * @example
	 *  button.inspect();
	 */
	inspect : function(){
		return "dataStore" + this.id;
	}
});


