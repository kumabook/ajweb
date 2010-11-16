		var message_database  = new ajweb.data.Database(
		    {
			id: "message_database",
			tablename: "message",
			url: "dbservlet",
			properties: {"message":"string","user":"string","posted":"datetime","room":"ref"},
			properties_list: ["message","user","posted","room"],
			persistence: "permanent",
			ref: [{"multiplicity":"1","table":"room"}]
		    }
		);
