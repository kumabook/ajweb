dojo.require("ajweb.connect");
dojo.require("ajweb.date");
dojo.require("ajweb.widget.Frame");
dojo.require("ajweb.widget.Label");
dojo.require("ajweb.widget.Panel");
dojo.require("ajweb.widget.Button");
dojo.require("ajweb.widget.Textbox");
dojo.require("ajweb.widget.Table");
dojo.require("ajweb.widget.Th");
dojo.require("ajweb.data.Database");
dojo.require("ajweb.widget.Selectbox");

dojo.addOnLoad(
  function(){
    ajweb.join("dbservlet");
    ajweb.log.level = "info";

    //ここから自動生成
    ajweb.addOnLoad(
      function()
      {
	ajweb.log.trace("onLoad");
	var ajweb_container = document.getElementById("ajweb_container");

    /*databasesの記述 */
    var room_database  = new ajweb.data.Database(
      {
	id: "room_database",
	tablename: "room",
	url: "dbservlet",
	properties: {"name": "string"},
	properties_list: ["name"],
	persistence: "permanent"
	}
    );

    var message_database = new ajweb.data.Database(
      {
	id: "message_database",
	tablename: "message",
	url: "dbservlet",
	properties: {"message":"string","name":"string","user":"string","posted":"datetime","room":"ref"},
	properties_list: ["message","name","user_name","posted","room"],
	persistence: "permanent",
	ref: [{"multiplicity":"1","table":"room"}]
      }
    );


/*interfacesの記述 */
    var rootFrame = new ajweb.widget.Frame({id: "rootFrame", top:"100px", left: "100px",height: "100%", width: "100%"});
    var roomSelectPanel = new ajweb.widget.Panel({id: "rootPanel", height: "100%", width: "100%"});
    rootFrame.addChildWidget(roomSelectPanel);

    var titleLabel = new ajweb.widget.Label({id: "titleLabel", content: "チャットアプリケーション", "left":"30px","top":"30px"});
    ajweb_container.appendChild(titleLabel.element);
    var selectRoomLabel = new ajweb.widget.Label({"content":"ルーム選択","id":"selectRoomLabel","left":"0px","top":"0px"});
    titleLabel.addChildWidget(selectRoomLabel);

    var roomSelectbox = new ajweb.widget.Selectbox({id: "roomSelectbox", top: "50px", left: "100px", label: "name"});

    roomSelectPanel.addChildWidget(roomSelectbox);
    var selectButton = new ajweb.widget.Button({"content":"選択","id":"selectButton","left":"370px","top":"45px"});
    roomSelectPanel.addChildWidget(selectButton);

    var chatRoomPanel = new ajweb.widget.Panel( {"id":"chatRoomPanel","height":"100%","width":"100%"});
    var nowRoomLabel = new ajweb.widget.Label({"content":"0","id":"nowRoomLabel","left":"60px","top":"0px"});
    chatRoomPanel.addChildWidget(nowRoomLabel);

    var contentsFrame = new ajweb.widget.Frame({"id": "contentsFrame", "height": "120px", "width": "600px", top: "50px"});
    var entrancePanel = new ajweb.widget.Panel({"id": "enterPanel", "height": "100px", "width": "600px"});
    var messagePanel = new ajweb.widget.Panel({"id": "messagePanel", "height": "100px", "width": "600px"});
    contentsFrame.addChildWidget(entrancePanel);
    contentsFrame.addChildWidget(messagePanel);
    contentsFrame.selectPanel({child:entrancePanel});

    chatRoomPanel.addChildWidget(contentsFrame);
    var userNameLabel = new ajweb.widget.Label({"content":"名前","id":"userNameLabel","left":"40px","top":"6px"});
    entrancePanel.addChildWidget(userNameLabel);
    var userNameTextbox = new ajweb.widget.Textbox({"content":"userNameTextbox","id":"user_name","left":"100px","top":"10px", "value": ""});
    entrancePanel.addChildWidget(userNameTextbox);

    var messageLabel = new ajweb.widget.Label({"content":"メッセージ","id":"message_label","left":"20px","top":"10px"});
    messagePanel.addChildWidget(messageLabel);
    var messageTextbox = new ajweb.widget.Textbox({"content":"message","id":"message","left":"150px","top":"10px","value": ""});
    messagePanel.addChildWidget(messageTextbox);
    var messageSubmitButton = new ajweb.widget.Button({"content":"送信","id":"messageSubmitButton","left":"100px","top":"50px"});
    messagePanel.addChildWidget(messageSubmitButton);
    var exitButton = new ajweb.widget.Button({"content":"退室","id":"exitButton","left":"100px","top":"50px", "left": "350px"});
    messagePanel.addChildWidget(exitButton);
    var enterButton = new ajweb.widget.Button({"content":"入室","id":"enterButton","left":"100px","top":"50px"});
    var backButton = new ajweb.widget.Button({"content":"ルーム選択画面に戻る","id":"backButton","left":"300px","top":"50px"});
    entrancePanel.addChildWidget(enterButton);
    entrancePanel.addChildWidget(backButton);

    var messageTable = new ajweb.widget.Table(
      {"id":"messageTable",
       "height":"600px","width":"800px","left":"100px","top":"200px"}
    );

    var th1 = new ajweb.widget.Th({"field":"user_name","name":"user",width: "auto", editable: true});
    var th2 = new ajweb.widget.Th({"field":"message","name":"message",width: "auto"});
    var th3 = new ajweb.widget.Th({"field":"posted","name":"posted",width: "350px"});
    var th4 = new ajweb.widget.Th({"field":"id","name":"id"});
    var th5 = new ajweb.widget.Th({"field":"room" ,"name":"room"});
    messageTable.addChildWidget(th1);
    messageTable.addChildWidget(th2);
    messageTable.addChildWidget(th3);
    messageTable.addChildWidget(th4);
    messageTable.addChildWidget(th5);


    chatRoomPanel.addChildWidget(messageTable);
    rootFrame.addChildWidget(chatRoomPanel);

/*eventsの記述 */
    //初期画面の設定
    dojo.connect(rootFrame, "startup", null, function(){
	rootFrame.selectPanel({child:roomSelectPanel});
    });


    //入室画面の初期化
    dojo.connect(roomSelectPanel, "startup", null, function(){
      //チャットルームの一覧の取得
		   room_database.select(function(items){
		   roomSelectbox.load(items);
	  });
	}
    );


    //チャットルーム画面の初期化
    dojo.connect(selectButton.widget, "onClick", null, function(){
		   rootFrame.selectPanel({child: chatRoomPanel});
		   nowRoomLabel.setContent(roomSelectbox.getSelectItem().name);
		   //メッセージリストの取得
		   message_database.selectByCondition(
		     new ajweb.data.Condition({op: "eq", left: new ajweb.data.Item({property:"room"}), right: roomSelectbox.getSelectItem()}),
		     function(items){
		       messageTable.load(items);
		     });
//		   message_database.param = {op: "eq", property: "room", value: roomSelectbox.getSelectItem().id};

		   ajweb.repoll("dbservlet");
		 });
    //入室処理
    dojo.connect(enterButton.widget, "onClick", null, function(){
		   message_database.insert({message : userNameTextbox.widget.value + "が入室しました",user_name : "システム",room : roomSelectbox.getSelectItem().id, posted : ajweb.date.now({})});
		   contentsFrame.selectPanel({child: messagePanel});
		 });
    //メッセージの送信
    dojo.connect(messageSubmitButton.widget, "onClick", null, function(){
		   message_database.insert({message : messageTextbox.widget.value,user_name : userNameTextbox.widget.value,room : roomSelectbox.getSelectItem().id,posted : ajweb.date.now({})});
		 });
    //メッセージの変更を反映
	var insert_condition =       new ajweb.data.Condition(
	{
	  op: "eq",
	  left: new ajweb.data.Item({database: message_database, property: "room"}),
	  // right: new ajweb.data.Item({element: roomSelectbox, getter: ""})
//	  right: 'ajweb.byId("roomSelectbox").getSelectItem({property: "id"});'
	  right: 'ajweb.byId("roomSelectbox").getSelectItem();'
	}
	);
    message_database.addCondition(insert_condition);

    dojo.connect(message_database, "onInsert", null ,
		 function(targetItem, database){
		   if(new ajweb.data.Condition({op: "eq", left: targetItem.room, right: roomSelectbox.getSelectItem()}).evaluate()){
		     messageTable.insert(targetItem);
		     }
		   });
    //退出処理
    dojo.connect(exitButton.widget, "onClick", null, function(){
		   message_database.insert({message : userNameTextbox.widget.value + "が退室しました",user_name : "システム",room : roomSelectbox.getSelectItem().id,posted : ajweb.date.now({})});
		   contentsFrame.selectPanel({child: entrancePanel});
    });
    //ルーム選択画面に戻る
    dojo.connect(backButton.widget, "onClick", null, function(){
		   rootFrame.selectPanel({child: roomSelectPanel});
    });
    //ここまで自動生成

    /*初期化処理 アプリケーション共通*/
    ajweb_container.appendChild(rootFrame.element);
    rootFrame.startup();
    ajweb.polling("dbservlet");
    dojo.connect(window, "offline", null, function(){
      ajweb.polling("dbservlet");
	});
    }
    );

});



