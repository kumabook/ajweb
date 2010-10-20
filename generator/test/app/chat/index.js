dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.ComboBox");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("ajweb.define");
dojo.require("ajweb.connect");
dojo.require("ajweb.widget.Frame");
dojo.require("ajweb.widget.Label");
dojo.require("ajweb.widget.Panel");
dojo.require("ajweb.widget.Button");
dojo.require("ajweb.widget.TextBox");
dojo.require("ajweb.widget.Table");
dojo.require("ajweb.data.Database");


dojo.addOnLoad(
  function()
  {

    ajweb.join("dbservlet");;

    var ajweb_container = new dijit.layout.ContentPane({}, "ajweb_container");

    var main = new ajweb.widget.Frame({id: "main", top:"100px", left: "100px",height: "100%", width: "100%"});
    var title_label = new ajweb.widget.Label({id: "title", content: "チャットアプリケーション", "left":"30px","top":"30px"});
    ajweb_container.domNode.appendChild(title_label.element);


    var entrance = new ajweb.widget.Panel({id: "entrance", height: "100%", width: "100%"});

    var select_room = new ajweb.widget.Label({"content":"ルーム選択","id":"room1_label","left":"0px","top":"0px"});
    entrance.add(select_room);

    var room_store  = new dojo.data.ItemFileWriteStore(
      {
	data: {
	  'identifier': "name",
	  'label' : "name",
	  items: [{id: 1,name: "ルーム1"}, {id: 2,name: "ルーム2"},{id: 3,name: "ルーム3"},{id: 4,name: "ルーム4"},{id: 5,name: "ルーム5"} ]
	  }
	});
    var selectBox = new dijit.form.ComboBox(
      {
	id: "roomSelect",
	style: {
	  position: "absolute",
	  top: "50px",
	  left: "100px"
	},
	name: "room",
	store: room_store,
	searchAttr: "name"
      }
    );

   selectBox.placeAt(entrance.widget.domNode);
    var selectButton = new ajweb.widget.Button({"content":"選択","id":"select","left":"370px","top":"45px"});
    dojo.connect(selectButton.widget, "onClick", null, function(){
		   main.selectPanel({child: chat_room});
		   now_room.content = "4";
		   message_store.param =  { op: "eq", property: "room_id", value:  "4"};
//		   alert(selectBox.attr("value"));
		   ajweb.send("dbservlet", "", "repoll", {});

		   now_room.element.innerHTML = selectBox.attr("value");
		   message_store.fetch();
		 });

    entrance.add(selectButton);

    var chat_room = new ajweb.widget.Panel( {"id":"chat_room","height":"100%","width":"100%"});
//    var now_room_label = new ajweb.widget.label({"content":"ルーム","id":"room1_label","left":"10px","top":"0px"});
    var now_room = new ajweb.widget.Label({"content":"0","id":"room1_label","left":"60px","top":"0px"});
//    chat_room.add(now_room_label);
    chat_room.add(now_room);

    var input_area = new ajweb.widget.Frame({"id": "input_area", "height": "120px", "width": "600px", top: "50px"});
    var enter_input = new ajweb.widget.Panel({"id": "enter_input", "height": "100px", "width": "600px"});
    var message_input = new ajweb.widget.Panel({"id": "message_input", "height": "100px", "width": "600px"});
    input_area.add(enter_input);
    input_area.add(message_input);
    input_area.selectPanel({child:enter_input});

    chat_room.add(input_area);
    var user_name_label = new ajweb.widget.Label({"content":"名前","id":"user_name_label","left":"40px","top":"6px"});
//    chat_room.add(user_name_label);
    enter_input.add(user_name_label);
    var user_name = new ajweb.widget.TextBox({"content":"user_name","id":"user_name","left":"100px","top":"10px", "value": ""});
    //chat_room.add(user_name);
    enter_input.add(user_name);

    var message_label = new ajweb.widget.Label({"content":"メッセージ","id":"message_label","left":"20px","top":"10px"});
//    chat_room.add(message_label);
    message_input.add(message_label);
    var message = new ajweb.widget.TextBox({"content":"message","id":"message","left":"150px","top":"10px","value": ""});
//  chat_room.add(message);
    message_input.add(message);
    var submit = new ajweb.widget.Button({"content":"送信","id":"submit","left":"100px","top":"50px"});
    dojo.connect(submit.widget, "onClick", null, function(){
		   ajweb.send("dbservlet", "chat", "insert", {message : message.element.value,user_name : user_name.element.value,room_id : now_room.content,posted : ajweb.date.now({})});
		 });
    message_input.add(submit);
    var exit_button = new ajweb.widget.Button({"content":"退室","id":"exit_button","left":"100px","top":"50px", "left": "350px"});
    dojo.connect(exit_button.widget, "onClick", null, function(){
		   ajweb.send("dbservlet", "chat", "insert", {message : user_name.element.value + "が退室しました",user_name : "システム",room_id : now_room.content,posted : ajweb.date.now({})});
		   input_area.selectPanel({child: enter_input});
		 });
    message_input.add(exit_button);

    var enter_button = new ajweb.widget.Button({"content":"入室","id":"enter_button","left":"100px","top":"50px"});
    dojo.connect(enter_button.widget, "onClick", null, function(){
		   ajweb.send("dbservlet", "chat", "insert", {message : user_name.element.value + "が入室しました",user_name : "システム",room_id : now_room.content,posted : ajweb.date.now({})});
		   input_area.selectPanel({child: message_input});
		 });
    enter_input.add(enter_button);
    var back_button = new ajweb.widget.Button({"content":"ルーム選択","id":"gack_button","left":"300px","top":"50px"});
    dojo.connect(back_button.widget, "onClick", null, function(){
		   main.selectPanel({child: entrance});
		 });
    enter_input.add(back_button);




    var message_store = new ajweb.data.Database({ id: "message_store",
						  tablename: "chat",
						  url: "dbservlet",
						  properties: ["user_name", "message", "posted"],
						  param: { op: "eq", property: "room_id", value: "1" }
						});
    ajweb.stores.push(message_store);
    message_store.fetch();
//    message_store.insert({message : "テスト1" ,user_name : "ひろき", posted : ajweb.date.now({})});
    var message_list = new ajweb.widget.Table(
      {"id":"message_list",
       "tablename": "chat",
       "structure": {
	 defaultCell: {editable: true}, cells:
	 [
	   {"field":"user_name","name":"user",width: "auto", editable: true},
	   {"field":"message","name":"message",width: "auto"},
	   {"field":"posted","name":"posted",width: "350px"},
	   {"field":"id","name":"id", hidden: "true"}
	 ]
       },
       "height":"600px","width":"800px","data":"message_store","left":"100px","top":"200px"}
    );

    chat_room.add(message_list);


    ajweb_container.domNode.appendChild(main.element);
    main.add(chat_room);
    main.add(entrance);
    main.selectPanel({child:entrance});
    ajweb_container.startup();
    main.startup();
//    chat_room.startup();
//    entrance.startup();

    ajweb.polling("dbservlet");

    message_list.startup();
    selectBox.startup();
  }
);
