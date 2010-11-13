dojo.require("ajweb.date");
dojo.require("ajweb.data.Condition");
dojo.require("ajweb.data.Database");

var room_database;
var message_database;

function setUp(){

  room_database  = new ajweb.data.Database(
    {
      id: "room_database",
      tablename: "room",
      url: "dbservlet",
      properties: {name: "string"},
      properties_list: ["name"],
      ref: [{table : "room", multiplicity: "*" }]
    }
  );

  message_database = new ajweb.data.Database(
    {
      id: "message_database",
      tablename: "chat",
      url: "dbservlet",
      properties: {user_name: "string", message: "string", posted: "datetime", room: "ref"},
      properties_list: ["user_name", "message", "posted", "room"],
      ref: [{table : "room", multiplicity: "1" }]
    }
  );
}

function tearDown(){
  ajweb.databases = [];
}

function testInsert() {
}
function testEncodeRefItem(){
  var item = {name: "ルーム１", id: 2};
  
  var encodedItem =  message_database.encodeRefItem(
    {
      user_name: "hiroki",
      message: "hello",
      posted: ajweb.date.now({}),
      room : item
    }
  );
  assertEquals(item.name, "ルーム１");
  assertEquals(item.id, 2);

  assertEquals(encodedItem.user_name, "hiroki");
  assertEquals(encodedItem.message, "hello");
  assertEquals(encodedItem.posted, ajweb.date.now({}));
  assertEquals(encodedItem.room, 2);

  assertEquals(item.name, "ルーム１");
  assertEquals(item.id, 2);
}
/*
function testUpdate() {
}
function testRemove() {
}
function testSelect() {
}
function testGetCache() {
}
function testClearCache() {
}
function testGetActionHistory() {
}
function testClearActionHistory() {
}
function testSendActionHistory() {
}
function testSaveActionHistory() {
}

*/