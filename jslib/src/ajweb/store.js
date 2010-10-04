dojo.require("dojo.data.ItemFileWriteStore");
dojo.provide("ajweb.data.store");
dojo.declare("ajweb.data.store", null,
{
  constructor : function(opt){
    this.url = opt.url;
    this.tablename = opt.tablename;
    this.properties = opt.properties;
    this.properties.push("id");
    var isContainId = false;
    this.param = opt.param;//condition

    this.store = new dojo.data.ItemFileWriteStore({ identifier: "id", data: {  items: []}});
    this.create();
    this.id = opt.id;
    this.history_tablename = opt.tablename + "_history";
//    this.history_properties = opt.properties
  },
  create : function() {
    ajweb.sql.create(this.tablename, this.properties);
  },
  drop : function(){
    ajweb.sql.drop(this.tablename);
  },
  fetch : function(){//読み込みなおし、clearとselect
    var store = this.store;
    if(navigator.onLine){//onlineならサーバからデータを取得
      ajweb.send("dbservlet", 
		 this.tablename, 
		 "select", 
		 null,
		 function(data){
		   var items = data.items;
		   for(var i = 0; i < items.length; i++){
		     console.log("fetch: " + dojo.toJson(items[i]));
		     store.newItem(items[i]);
		   }
		 }
		);
    }
    else{
      this.clear();
      var items = this.select();
      for(var i = 0; i < items.length; i++){
//	     alert(dojo.toJson(items[i]));
	this.store.newItem(items[i]);
      }
 }
  },
  insert: function(params){
    if(navigator.onLine){//onlineならサーバに送信
      ajweb.send("dbservlet", 
		 this.tablename, 
		 "insert", 
		 params
		);
      
    }
    else {//offlineならローカルデータベースに保存し、変更履歴を保存。
      var item = ajweb.sql.insert(this.tablename, this.properties, params);
      this.store.newItem(item);
      this.saveHistory("insert",item);
//      alert(dojo.toJson(item));
    }
  },
  remove: function(params){
    if(navigator.onLine){
      ajweb.send("dbservlet", 
		 this.tablename, 
		 "delete", 
		 params
		);
    }
    else {
      ajweb.sql.remove(this.tablename, params);
      this.saveHistory("delete", params);
      var store = this.store;
      store.fetch({
		  query: {id : params.id},
		  onComplete: function(items, request){
		    for(var i = 0; i < items.length; i++){
		      store.deleteItem(items[i]);
		    }
		  }
		  }
		 );
    }
  },
  update: function(params){
    //alert("update ");// + dojo.toJson(params));
    var json = ajweb.toJSON(params);
    if(navigator.onLine){
      console.log("update online");
      ajweb.send("dbservlet", 
		 this.tablename, 
		 "update", 
		 params
		);
    } 
    else {
    ajweb.sql.update(this.tablename, this.properties, params);      
      var properties = this.properties;
//      console.log(dojo.toJson(params));
      this.saveHistory("update", params);
      var store = this.store;
      store.fetch({
		    query: {id : params.id},
	 onComplete: function(items, request){//ここに重い処理はかかない
	   for(var i = 0; i < items.length; i++){
	     for(var j = 0; j < properties.length; j++){
	       store.setValue(items[i], properties[j], params[properties[j]]);	       
	     }
	   }
	 }
	}
      );
    }
  },
  select: function(where){
   var items;
    if(navigator.onLine){
/*      ajweb.send("dbservlet", 
		 this.tablename, 
		 "select", 
		 null,
		 function(data){
		   items = data.items;
		 }
		);
      return items;*/
    }
//    else {
      return ajweb.sql.select(this.tablename, this.properties, where);
  //  }
      
  },

  saveHistory : function(action, params){
  var properties = this.properties;
    this.properties.push("action");
    params.action = action;
    ajweb.sql.insert(this.history_tablename, this.properties, params);
    this.properties.pop();
  },
  clear: function(){
    var store = this.store;
    store.fetch({ 
		  onComplete: function(items, request){
		    for(var i = 0; i < items.length; i++){
		      store.deleteItem(items[i]);
		    }
		  }
		}
	       );
  },
  getHistory : function(){
    this.properties.push("action");
    var histories = ajweb.sql.select(this.history_tablename, this.properties);
    this.properties.pop();
    return histories;
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


ajweb.data.store.getStore = function(name){
  for(var i = 0; i < ajweb.stores.length; i++){
    alert(ajweb.stores[i].tablename  + "  " + name);
    if(ajweb.stores[i].tablename == name)
      return ajweb.stores[i];
  }
  return null;
};




dojo.addOnLoad(function(){

dojo.declare("ajweb.data._store", dojo.data.ItemFileWriteStore,
	     {
	
	       getItems: function(){
		 var result = {};
		 this.fetch({
			      onComplete: function(items, request){
				alert(items);
				result = items;
			      }
			     
			    });
		 return result;
	       }
	     }
	    );

});