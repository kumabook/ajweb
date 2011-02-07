dojo.require("ajweb.connect");
dojo.require("ajweb.date");
dojo.require("ajweb.widget.Frame");
dojo.require("ajweb.widget.Label");
dojo.require("ajweb.widget.Text");
dojo.require("ajweb.widget.Panel");
dojo.require("ajweb.widget.Dialog");
dojo.require("ajweb.widget.Button");
dojo.require("ajweb.widget.Textbox");
dojo.require("ajweb.widget.Textarea");
dojo.require("ajweb.widget.Table");
dojo.require("ajweb.widget.Th");
dojo.require("ajweb.data.Database");
dojo.require("ajweb.widget.Selectbox");
dojo.require("ajweb.widget.Passwordbox");
dojo.require("ajweb.widget.Calendar");
dojo.require("ajweb.widget.DateTextbox");
dojo.require("ajweb.widget.TimeTextbox");


dojo.addOnLoad(
  function(){
    ajweb.join("dbservlet");
    ajweb.log.level = "info";


    ajweb.addOnLoad(
      function()
      {
	ajweb.log.trace("onLoad");
	var ajweb_container = document.getElementById("ajweb_container");
/*-----------------------------------ここから自動生成-------------------------------*/
/*databases model */
var users  = new ajweb.data.Database(
		    {
			id: "users",
			tablename: "users",
			url: "dbservlet",
			properties: {"role":"string","user_id":"string","password":"password"},
			properties_list: ["role","user_id","password"],
			persistence: "permanent",
			ref: []
		    }
		);
var message  = new ajweb.data.Database(
		    {
			id: "message",
			tablename: "message",
			url: "dbservlet",
			properties: {"message":"string","user_name":"string","posted":"datetime","room":"int"},
			properties_list: ["message","user_name","posted","room"],
			persistence: "permanent",
			ref: []
		    }
		);
var room  = new ajweb.data.Database(
		    {
			id: "room",
			tablename: "room",
			url: "dbservlet",
			properties: {"name":"string"},
			properties_list: ["name"],
			persistence: "permanent",
			ref: []
		    }
		);

/*interfaces model */
			var rootPanel = new ajweb.widget.Panel({"id":"rootPanel","height":"500px","width":"700px","left":"72","_isDisplay":"false","top":"2"});
			var label0 = new ajweb.widget.Label({"content":"Chat Application","id":"label0","left":"27px","top":"22px"});
			rootPanel.addChildWidget(label0);
			var rootFrame = new ajweb.widget.Frame({"id":"rootFrame","height":"450px","width":"650px","left":"25px","top":"45px"});
			var loginPanel = new ajweb.widget.Panel({"id":"loginPanel","height":"450px","width":"650px","left":"97","_isDisplay":"false","top":"2"});
			var label1 = new ajweb.widget.Label({"content":"UserID","id":"label1","left":"29px","top":"29px"});
			loginPanel.addChildWidget(label1);
			var userIdTextbox = new ajweb.widget.Textbox({"id":"userIdTextbox","placeHolder":"user name","width":"100px","left":"132px","top":"29px"});
			loginPanel.addChildWidget(userIdTextbox);
			var label2 = new ajweb.widget.Label({"content":"Password","id":"label2","left":"29px","top":"59px"});
			loginPanel.addChildWidget(label2);
			var button1 = new ajweb.widget.Button({"content":"Login","id":"button1","left":"32px","top":"91px"});
			loginPanel.addChildWidget(button1);
			var passwordbox = new ajweb.widget.Passwordbox({"id":"passwordbox","width":"100px","left":"131px","top":"61px"});
			loginPanel.addChildWidget(passwordbox);
			rootFrame.addChildWidget(loginPanel);
			var roomSelectPanel = new ajweb.widget.Panel({"id":"roomSelectPanel","height":"450px","width":"650px","left":"97","_isDisplay":"false","top":"2"});
			var label3 = new ajweb.widget.Label({"content":"room select","id":"label3","left":"0px","top":"0px"});
			roomSelectPanel.addChildWidget(label3);
			var selectButton = new ajweb.widget.Button({"content":"Selection","id":"selectButton","left":"369px","top":"50px"});
			roomSelectPanel.addChildWidget(selectButton);
			var roomSelect = new ajweb.widget.Selectbox({"id":"roomSelect","data":"room","label":"name","left":"100px","top":"50px"});
			roomSelectPanel.addChildWidget(roomSelect);
			rootFrame.addChildWidget(roomSelectPanel);
			var chatRoomPanel = new ajweb.widget.Panel({"id":"chatRoomPanel","height":"450px","width":"650px","left":"97","_isDisplay":"false","top":"2"});
			var nowRoomLabel = new ajweb.widget.Label({"content":"room name","id":"nowRoomLabel","left":"60px","top":"0px"});
			chatRoomPanel.addChildWidget(nowRoomLabel);
			var contentsFrame = new ajweb.widget.Frame({"id":"contentsFrame","height":"100px","width":"450px","left":"25px","top":"80px"});
			var entrancePanel = new ajweb.widget.Panel({"id":"entrancePanel","height":"100px","width":"450px","left":"197","_isDisplay":"false","top":"90.5"});
			var userNameLabel = new ajweb.widget.Label({"content":"Name","id":"userNameLabel","left":"25px","top":"12px"});
			entrancePanel.addChildWidget(userNameLabel);
			var userNameTextbox = new ajweb.widget.Textbox({"id":"userNameTextbox","width":"100px","left":"100px","top":"10px"});
			entrancePanel.addChildWidget(userNameTextbox);
			var enterButton = new ajweb.widget.Button({"content":"Entering","id":"enterButton","left":"99px","top":"49px"});
			entrancePanel.addChildWidget(enterButton);
			var backButton = new ajweb.widget.Button({"content":"Back to Room Selection ","id":"backButton","left":"262px","top":"50px"});
			entrancePanel.addChildWidget(backButton);
			contentsFrame.addChildWidget(entrancePanel);
			var messagePanel = new ajweb.widget.Panel({"id":"messagePanel","height":"100px","width":"450px","left":"197","_isDisplay":"true","top":"90.5"});
			var messageLabel = new ajweb.widget.Label({"content":"Message","id":"messageLabel","left":"20px","top":"10px"});
			messagePanel.addChildWidget(messageLabel);
			var messageTextbox = new ajweb.widget.Textbox({"id":"messageTextbox","width":"100px","left":"150px","top":"10px"});
			messagePanel.addChildWidget(messageTextbox);
			var messageSubmitButton = new ajweb.widget.Button({"content":"Send","id":"messageSubmitButton","left":"96px","top":"46px"});
			messagePanel.addChildWidget(messageSubmitButton);
			var exitButton = new ajweb.widget.Button({"content":"Leave","id":"exitButton","left":"347px","top":"47px"});
			messagePanel.addChildWidget(exitButton);
			contentsFrame.addChildWidget(messagePanel);
			chatRoomPanel.addChildWidget(contentsFrame);
			var messageTable = new ajweb.widget.Table({"id":"messageTable","height":"225px","width":"600px","data":"message","left":"25px","top":"200px"});
			var th0 = new ajweb.widget.Th({"field":"user_name","id":"th0","width":"100px","label":"user_name","left":"203","_data":"message","top":"13"});
			messageTable.addChildWidget(th0);
			var th1 = new ajweb.widget.Th({"field":"message","id":"th1","width":"100px","label":"message","left":"343","_data":"message","top":"30"});
			messageTable.addChildWidget(th1);
			var th2 = new ajweb.widget.Th({"field":"posted","id":"th2","width":"350px","label":"posted","left":"354","_data":"message","top":"25"});
			messageTable.addChildWidget(th2);
			var th3 = new ajweb.widget.Th({"field":"room","id":"th3","width":"30px","label":"room","left":"350","_data":"message","top":"37"});
			messageTable.addChildWidget(th3);
			chatRoomPanel.addChildWidget(messageTable);
			rootFrame.addChildWidget(chatRoomPanel);
			rootPanel.addChildWidget(rootFrame);
/*events model */
		ajweb.addEvent(rootFrame, "onDisplay", true, function(receivedItem, database){
			rootFrame.selectPanel({panel:loginPanel});
			
			ajweb.repoll("dbservlet");
			}			
			);
		ajweb.addEvent(button1, "onClick", true, function(receivedItem, database){
			ajweb.data.login(
					{user_id:userIdTextbox.getValue({ }), password:passwordbox.getValue({ })}
					, function(item){
					
					if(item.result){
						rootFrame.selectPanel({panel:roomSelectPanel});
			
					}
					else {
					
					}
			}
				);
			
			ajweb.repoll("dbservlet");
			}			
			);
		ajweb.addEvent(roomSelectPanel, "onDisplay", true, function(receivedItem, database){
			room.select(
					{ }
					, function(items0){
					roomSelect.load({items:items0});
					}
				);
			
			ajweb.repoll("dbservlet");
			}			
			);
		ajweb.addEvent(selectButton, "onClick", true, function(receivedItem, database){
			rootFrame.selectPanel({panel:chatRoomPanel});
			nowRoomLabel.setContent({content:roomSelect.getSelectItemProperty({ property: "name"})});
			message.selectByCondition(
					{ condition: new ajweb.data.Condition(
				    {
				    	op: "eq",
					left: function(receivedItem){return roomSelect.getSelectItem({ });},
					right: function(receivedItem){return new ajweb.data.Item({ property: "room"});;}
				    }
			)}
					, function(items0){
					messageTable.load({items:items0});
					}
				);
			
			ajweb.repoll("dbservlet");
			}			
			);
		ajweb.addEvent(enterButton, "onClick", true, function(receivedItem, database){
			message.insert(
					{message:ajweb.string.concat({ first: userNameTextbox.getValue({ }), second: ajweb.string.direct({ value: "が入室しました｡"})}), posted:ajweb.datetime.now({ }), room:roomSelect.getSelectItem({ }), user_name:userNameTextbox.getValue({ })}
					, function(item){
					
					contentsFrame.selectPanel({panel:messagePanel});
			}
				);
			
			ajweb.repoll("dbservlet");
			}			
			);
		ajweb.addEvent(backButton, "onClick", true, function(receivedItem, database){
			rootFrame.selectPanel({panel:roomSelectPanel});
			
			ajweb.repoll("dbservlet");
			}			
			);
		ajweb.addEvent(messageSubmitButton, "onClick", true, function(receivedItem, database){
			message.insert(
					{message:messageTextbox.getValue({ }), posted:ajweb.datetime.now({ }), room:roomSelect.getSelectItem({ }), user_name:userNameTextbox.getValue({ })}
					, function(item){
					
					}
				);
			
			ajweb.repoll("dbservlet");
			}			
			);
		ajweb.addEvent(message, "onInsert", new ajweb.data.Condition(
				    {
				    	op: "eq",
					left: function(receivedItem){return receivedItem.room;},
					right: function(receivedItem){return roomSelect.getSelectItem({ });}
				    }
			), function(receivedItem, database){
			messageTable.insert({item:receivedItem});
			
			ajweb.repoll("dbservlet");
			}			
			);
		message.addCondition(new ajweb.data.Condition(
				    {
				    	op: "eq",
					left: function(receivedItem){return new ajweb.data.Item({database:message, property: "room"});},
					right: function(receivedItem){return roomSelect.getSelectItem({ });}
				    }
			)
		);
		ajweb.addEvent(exitButton, "onClick", true, function(receivedItem, database){
			message.insert(
					{message:ajweb.string.concat({ first: userNameTextbox.getValue({ }), second: ajweb.string.direct({ value: "が退室しました｡"})}), posted:ajweb.datetime.now({ }), room:roomSelect.getSelectItem({ }), user_name:userNameTextbox.getValue({ })}
					, function(item){
					
					contentsFrame.selectPanel({panel:entrancePanel});
			}
				);
			
			ajweb.repoll("dbservlet");
			}			
			);

/*-----------------------------------generated source-------------------------------*/   
	ajweb_container.appendChild(rootPanel.element);
        rootPanel.display();
    	ajweb.polling("dbservlet");
	dojo.connect(window, "offline", null, function(){
			     ajweb.polling("dbservlet");
	});
      }
    );

});

dojo.addOnUnload(
  function(){
    ajweb.quit("dbservlet");
});