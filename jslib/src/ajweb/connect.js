/**
 * @fileOverview 通信用の関数を定義
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.connect");

/** @namespace ajweb.connect */
ajweb.connect = {};
/** methodOf ajweb.connect# */
ajweb.send = function(url, table, action, json, callback){
  ajweb.log.trace("ajweb.send " + table + "  " + action + "  ");
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
	ajweb.log.trace( action + " response=" + ajweb.toJSON(data));
      },
      error:function(error, args){
	ajweb.log.error(action + " error! : "+ error);
	//alert("システムエラー!!");
      }
    });
};

/** methodOf ajweb.connect# */
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
	ajweb.log.trace("join  response=" + data);
	if(typeof data == 'number')
	  ajweb.pollingInterval = data;
	else 
	  ajweb.pollingInterval = ajweb.DEFAULT_POLLING_INTERVAL;
	for(var i = 0; i < ajweb.onLoad.length; i++){
	  ajweb.onLoad[i]();//joinした後にアプリケーションコードを呼び出す
	}
//	ajweb.polling(url);
      },
      error:function(error, args){
	ajweb.log.trace("join error! : "+ error);
      }
    }
  );
};


ajweb.quit = function(url){
  dojo.xhrPost(
    {
      url: url,
      handleAs: "json",
      content: {
	"action": "quit",
	"param" : dojo.toJson({})
      },
      load: function(data, ioargs){
	ajweb.log.trace("quit  response=" + data);
      },
      error:function(error, args){
	ajweb.log.trace("quit error! : "+ error);
      }
    }
  );
};
/** methodOf ajweb.connect# */
// 監視する対象 table 名とcondition(param)の配列   //グローバル変数を参照する
ajweb.polling = function(url){
  var param = ajweb.data.toJSONConditions();
  ajweb.log.info(param);
  dojo.xhrPost(
    {
      url: url,
      handleAs: "json",
      content: {
	"action": "poll",
	"param" : param
      },
      load: function(data, ioargs){// サーバデータの変更の配列が送られてくる
	ajweb.log.trace("polling response: " + dojo.toJson(data));
	for(var i = 0; i < data.length; i++){
	  for(var j = 0; j < ajweb.databases.length; j++){
	    if(ajweb.databases[j].tablename == data[i].table){
	      try{
		if(data[i].action == "insert"){//テーブルが等しいだけで入れてよい？
		    ajweb.databases[j].onInsert(data[i].item);
		}
		else if(data[i].action == "delete"){// conditiony要素からquery作成かまたは, dojo queryに対応?
		  ajweb.databases[j].onDelete(data[i].item);
		}
		else if(data[i].action == "update"){
		  ajweb.databases[j].onUpdate(data[i].item);
		}
	      } catch(e){
	      ajweb.log.error(e);
	      }
	    }
	  }
	}
//        ajweb.polling(url);
	setTimeout(function(){
		     ajweb.polling(url);
		   }, ajweb.pollingInterval);
      },
      error:function(error, args){
	console.log(" poll error!"+ error);
	if(navigator.onLine){
	  console.log(args.xhr.status);
	  if(args.xhr.status == '403')
	    ajweb.polling(url);
	}
      }
    }
  );
};

ajweb.repoll = function(url){
  dojo.xhrPost(
    {
      url: url,
      handleAs: "json",
      content: {
	"action": "repoll",
	"param" : "{}"
      },
      load: function(data, ioargs){
	ajweb.log.trace("repoll  response=" + data);
      },
      error:function(error, args){
	ajweb.log.trace("repoll error! : "+ error);
      }
    }
  );
};

/** methodOf ajweb.connect# */
ajweb.sync = function(){
//サーバの変更を取得


//自分の変更をサーバに反映
//変更の履歴を取得
/*
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
    });*/
};



ajweb.onLoad = [];
ajweb.addOnLoad = function(func){
  ajweb.onLoad.push(func);
};


ajweb.addEvent = function(target, type, condition, action){
  dojo.connect(target, type, null, function(targetItem, database){
    if(condition.evaluate())
      action(targetItem);
	 }
  );
};