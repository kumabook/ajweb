			var rootFrame = new ajweb.widget.Frame({"id":"rootFrame","height":"100%","width":"100%","left":"0px","top":"0px"});
			var chat_room = new ajweb.widget.Panel({"id":"chat_room","height":"100%","width":"100%"});
			var user_name_label = new ajweb.widget.Label({"id":"user_name_label","content":"名前","left":"20px","top":"10px"});
			chat_room.addChildWidget(user_name_label);
			var user_name = new ajweb.widget.Textbox({"id":"user_name","content":"user_name","left":"100px","top":"10px"});
			chat_room.addChildWidget(user_name);
			var message_label = new ajweb.widget.Label({"id":"message_label","content":"メッセージ","left":"20px","top":"30px"});
			chat_room.addChildWidget(message_label);
			var message = new ajweb.widget.Textbox({"id":"message","content":"message","left":"100px","top":"30px"});
			chat_room.addChildWidget(message);
			var submit = new ajweb.widget.Button({"id":"submit","content":"submit","left":"100px","top":"50px"});
			chat_room.addChildWidget(submit);
			var message_list = new ajweb.widget.Table({"id":"message_list","height":"500px","width":"400px","left":"100px","top":"100px"});
			var th_0 = new ajweb.widget.Th({"field":"user_name","id":"th_0","name":"名前"});
			message_list.addChildWidget(th_0);
			var th_1 = new ajweb.widget.Th({"field":"message","id":"th_1","name":"メッセージ"});
			message_list.addChildWidget(th_1);
			var th_2 = new ajweb.widget.Th({"field":"posted","id":"th_2","name":"投稿日時"});
			message_list.addChildWidget(th_2);
			chat_room.addChildWidget(message_list);
			rootFrame.addChildWidget(chat_room);