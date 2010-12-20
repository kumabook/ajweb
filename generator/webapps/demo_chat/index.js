dojo.require("ajweb.connect");
dojo.require("ajweb.date");
dojo.require("ajweb.widget.Frame");
dojo.require("ajweb.widget.Label");
dojo.require("ajweb.widget.Panel");
dojo.require("ajweb.widget.Dialog");
dojo.require("ajweb.widget.Button");
dojo.require("ajweb.widget.Textbox");
dojo.require("ajweb.widget.Table");
dojo.require("ajweb.widget.Th");
dojo.require("ajweb.data.Database");
dojo.require("ajweb.widget.Selectbox");
dojo.require("ajweb.widget.Passwordbox");

dojo.addOnLoad(
    function(){
      ajweb.join("dbservlet");
    ajweb.log.level = "all";

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


    var rootPanel = new ajweb.widget.Panel({id: "rootPanel", top:"0px", left: "0px",height: "100%", width: "100%"});

    var titleLabel = new ajweb.widget.Label({id: "titleLabel", content: "チャットアプリケーション", "left":"30px","top":"30px"});
    rootPanel.addChildWidget(titleLabel);
    var rootFrame = new ajweb.widget.Frame({id: "rootFrame", top:"100px", left: "100px",height: "90%", width: "90%"});
    rootPanel.addChildWidget(rootFrame);
//ログイン画面
    var loginPanel = new ajweb.widget.Panel({id: "loginPanel", height: "100%", width: "100%"});
    var userIdLabel = new ajweb.widget.Label({id: "userIdLabel", content: "ユーザID", left: "30px", top: "30px"});
    var userIdTextbox = new ajweb.widget.Textbox({id: "userIdTextbox", content:"", left: "130px", top: "30px"});
    var passwordLabel = new ajweb.widget.Label({id: "userIdLabel", content: "パスワード",left: "30px", top: "60px"});
    var passwordTextbox = new ajweb.widget.Passwordbox({id: "passwordTextbox", content:"", left: "130px", top: "60px"});

    var loginButton = new ajweb.widget.Button({id: "loginButton", content: "ログイン", left: "30px", top: "90px"});

    loginPanel.addChildWidget(userIdLabel);
    loginPanel.addChildWidget(userIdTextbox);
    loginPanel.addChildWidget(passwordLabel);
    loginPanel.addChildWidget(passwordTextbox);
    loginPanel.addChildWidget(loginButton);

    rootFrame.addChildWidget(loginPanel);

//ログインメッセージダイアログ
    var loginFailDialog = new ajweb.widget.Dialog({id: "loginFailDialog", title: "login failed", width: "300px", height:"100px", content: "ログインに失敗しました"});

//チャットルーム選択画面
    var roomSelectPanel = new ajweb.widget.Panel({id: "roomSelectPanel", height: "100%", width: "100%"});
    rootFrame.addChildWidget(roomSelectPanel);


    var selectRoomLabel = new ajweb.widget.Label({"content":"ルーム選択","id":"selectRoomLabel","left":"0px","top":"0px"});
    titleLabel.addChildWidget(selectRoomLabel);

    var roomSelectbox = new ajweb.widget.Selectbox({id: "roomSelectbox", top: "50px", left: "100px", label: "name"});

    roomSelectPanel.addChildWidget(roomSelectbox);
    var selectButton = new ajweb.widget.Button({"content":"選択","id":"selectButton","left":"370px","top":"45px"});
    roomSelectPanel.addChildWidget(selectButton);
//チャットルーム画面
    var chatRoomPanel = new ajweb.widget.Panel( {"id":"chatRoomPanel","height":"100%","width":"100%"});
    var nowRoomLabel = new ajweb.widget.Label({"content":"0","id":"nowRoomLabel","left":"60px","top":"0px"});
    chatRoomPanel.addChildWidget(nowRoomLabel);

    var contentsFrame = new ajweb.widget.Frame({"id": "contentsFrame", "height": "120px", "width": "600px", top: "50px"});
    var entrancePanel = new ajweb.widget.Panel({"id": "enterPanel", "height": "100px", "width": "600px"});
    var messagePanel = new ajweb.widget.Panel({"id": "messagePanel", "height": "100px", "width": "600px"});

    contentsFrame.addChildWidget(entrancePanel);
    contentsFrame.addChildWidget(messagePanel);
    contentsFrame.selectPanel({panel:entrancePanel});
// ユーザ名入力欄
    chatRoomPanel.addChildWidget(contentsFrame);
    var userNameLabel = new ajweb.widget.Label({"content":"名前","id":"userNameLabel","left":"40px","top":"6px"});
    entrancePanel.addChildWidget(userNameLabel);
    var userNameTextbox = new ajweb.widget.Textbox({"id":"userNameTextbox","content":"user_name","left":"100px","top":"10px", "value": ""});
    entrancePanel.addChildWidget(userNameTextbox);

// メッセージ名入力欄
    var messageLabel = new ajweb.widget.Label({"content":"メッセージ","id":"messageLabel","left":"20px","top":"10px"});
    messagePanel.addChildWidget(messageLabel);
    var messageTextbox = new ajweb.widget.Textbox({"content":"message","id":"messageTextbox","left":"150px","top":"10px","value": ""});
    messagePanel.addChildWidget(messageTextbox);
    var messageSubmitButton = new ajweb.widget.Button({"content":"送信","id":"messageSubmitButton","left":"100px","top":"50px"});
    messagePanel.addChildWidget(messageSubmitButton);
    var exitButton = new ajweb.widget.Button({"content":"退室","id":"exitButton","top":"50px", "left": "350px"});
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
    ajweb.addEvent(rootFrame, "onDisplay", true, function(){
//		     alert("handler");
//	rootFrame.selectPanel({child:roomSelectPanel});
	rootFrame.selectPanel({panel:loginPanel});
	rootFrame.widget.startup();
    });

    //ログイン処理

    ajweb.addEvent(loginButton, "onClick", true, function(){
      ajweb.data.login(
	{ user_id: userIdTextbox.getValue(), password: passwordTextbox.getValue()},
	function(item){
	  if(item.result){
	    rootFrame.selectPanel({panel:roomSelectPanel});
	  }
	  else {
	    loginFailDialog.show();
	  }
	}
      );
    });

    //入室画面の初期化
    ajweb.addEvent(roomSelectPanel, "onDisplay", true, function(){
      //チャットルームの一覧の取得
		   room_database.select(function(items){
		   roomSelectbox.load(items);
	  });
	}
    );


    //チャットルーム画面の初期化
    ajweb.addEvent(selectButton, "onClick", true, function(){
		   rootFrame.selectPanel({panel: chatRoomPanel});
		   nowRoomLabel.setContent(roomSelectbox.getSelectItem().name);
		   //メッセージリストの取得
		   message_database.selectByCondition(
		     new ajweb.data.Condition({
						op: "eq",
						left: function(){ return new ajweb.data.Item({property:"room"});},
						right: function(){ return roomSelectbox.getSelectItem();}}),
		     function(items){
		       messageTable.load({datum:items});
		     }
		   );

		   ajweb.repoll("dbservlet");
		 });
    //入室処理
    ajweb.addEvent(enterButton, "onClick", true, function(){
		     message_database.insert({message : userNameTextbox.getValue() + "が入室しました",user_name : "システム",room : roomSelectbox.getSelectItem({property: "id"}), posted : new ajweb.date({})});
		   contentsFrame.selectPanel({panel: messagePanel});
		 });
    //メッセージの送信
    ajweb.addEvent(messageSubmitButton.widget, "onClick", true, function(){
		   message_database.insert({message : messageTextbox.getValue() ,user_name : userNameTextbox.getValue() ,room : roomSelectbox.getSelectItem({property: "id"}), posted : new ajweb.date({})});
		 });
    //メッセージの変更を反映
    var insert_condition = new ajweb.data.Condition(
	{
	  op: "eq",
	  left: function(receivedItem){
	    if(receivedItem)
	      return receivedItem.room;
	    else
	      return new ajweb.data.Item({database: message_database, property: "room"
	  });},
	  right: function(){ return roomSelectbox.getSelectItem();}
	}
    );
    message_database.addCondition(insert_condition);

    ajweb.addEvent(
      message_database,
      "onInsert",
      new ajweb.data.Condition(
	{
	  op: "eq",
	  left: function(receivedItem){
	    if(receivedItem)
	      return receivedItem.room;
	    else
	      return new ajweb.data.Item({database: message_database, property: "room"});
	  },
	  right: function(){ return roomSelectbox.getSelectItem(); }
	}
      ),
      function(receivedItem){
	messageTable.insert(receivedItem);
      }
    );

    //退出処理
    ajweb.addEvent(exitButton, "onClick", true, function(){
		   message_database.insert({message : userNameTextbox.getValue() + "が退室しました",user_name : "システム",room : roomSelectbox.getSelectItem().id, posted : new ajweb.date({})});
		   contentsFrame.selectPanel({panel: entrancePanel});
    });
    //ルーム選択画面に戻る
    ajweb.addEvent(backButton, "onClick", true, function(){
		   rootFrame.selectPanel({panel: roomSelectPanel});
    });
    //ここまで自動生成
    /*初期化処理 アプリケーション共通*/
    ajweb_container.appendChild(rootPanel.element);

    rootPanel.display();

    ajweb.polling("dbservlet");
    dojo.connect(window, "offline", null, function(){
      ajweb.polling("dbservlet");
	});
      }
    );

});




