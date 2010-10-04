ajweb.stores = [];//
ajweb.send = function(url, table, action, json, callback){
  console.log("ajweb.send " + table + "  " + action + "  ");
//var json = ajweb.toJSON(params);
  dojo.xhrPost(
    {
      url: url,
      handleAs: "json",
      content: {
	"action": action,
	"table": table,
	"param" : ajweb.toJSON(json)
      },
      load: function(data, ioargs){
	if(callback){
	  callback(data);
	}
	console.log( action + " response=" + data);
      },
      error:function(error, args){
	console.log(action + " error! : "+ error);
      }
    });
};

ajweb.join = function(url){
  dojo.xhrPost(
    {
      url: url,
      handleAs: "json",
      content: {
	"action": "join",
	"param" : dojo.toJson({})
      },
      load: function(data, ioargs){
	console.log("join  response=" + data);
//	ajweb.polling(url); 
      },
      error:function(error, args){
	console.log("join error! : "+ error);
      }
    }
  );
};
// 監視する対象 table 名とcondition(param)の配列   //グローバル変数を参照する
ajweb.polling = function(url){
  var param = {};
  for(var i = 0; i < ajweb.stores.length; i++){//	storeから ポーリング条件を取得
	//alert(dojo.toJson(ajweb.stores[i].param));
//	alert(dojo.toJson(param));
    param[ajweb.stores[i].tablename] = ajweb.stores[i].param;
  };
//	param["schedule"] = { "op": "eq" , "property": "user_name", "value": "ajweb"};
  dojo.xhrPost(
    {
      url: url,
      handleAs: "json",
      content: {
	"action": "poll",
	"param" : dojo.toJson(param)
      },
      load: function(data, ioargs){// サーバデータの変更の配列が送られてくる
	console.log("polling response: " + dojo.toJson(data));	
	//		alert(dojo.toJson(data));
	for(var i = 0; i < data.length; i++){
	  for(var j = 0; j < ajweb.stores.length; j++){
	    if(ajweb.stores[j].tablename == data[i].table){
	      //		alert(ajweb.stores[j].param.value + " ==  " + data[i].item[ajweb.stores[j].param.property]); 
	      if(ajweb.stores[j].param.value == data[i].item[ajweb.stores[j].param.property]){
		if(data[i].action == "insert"){//テーブルが等しいだけで入れてよい？
		  try{
//		    console.log("insert " + dojo.toJson(data[i].item));	
		    ajweb.stores[j].store.newItem(data[i].item);
		  } catch(e){
		    console.log("error: newItem already exists");
		    //	alert(e);
		  }
		}
		else if(data[i].action == "delete"){// conditiony要素からquery作成かまたは, dojo queryに対応?
		  ajweb.stores[j].remove(data[i]);
/*		  var query = {room_name :data[i].item.room_name};
		  
		  ajweb.stores[j].store.fetch({ query: query,
						onComplete: function(items, request){
						  for (var k = 0; k < items.length; k++){
						    ajweb.stores[j].store.deleteItem(items[k]);
						  }
								//store.save({onComplete: foo, onError: });
						}});
		  //	ajweb.stores[j].store.deleteItem(item);*/
		  //alert("complete" + data[i].table);
		}
		else if(data[i].action == "update"){
		  var query = {id :data[i].item.id};
		  ajweb.stores[j].update(data[i]);
		}
	      }
	    }
	  }
	}
        ajweb.polling(url);
      },
      error:function(error, args){
	console.log(" poll error!"+ error);
	//				ajweb.polling(url,  param);
      }
    }
  );
};

ajweb.sync = function(){
//サーバの変更を取得


//自分の変更をサーバに反映
//変更の履歴を取得
  console.log("sync start");
  var history = {};
 for(var i = 0; i < ajweb.stores.length; i++){
  history[ajweb.stores[i].tablename] = ajweb.stores[i].getHistory();
 }
  var json = dojo.toJson(history);
  console.log("sync send:" + json);

  //サーバへ送信
  dojo.xhrPost(
    {
      url: url,
      handleAs: "json",
      content: {
	"action": "sync",
	"param" : json
      },
      load: function(data, ioargs){
	console.log("sync response:" + data);
      },
      error:function(error, args){
	console.log("sync  error: "+ error);
      }
    });  
};