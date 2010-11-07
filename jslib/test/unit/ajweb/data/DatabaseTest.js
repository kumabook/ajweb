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
      properties: ["name"]
    }
  );
  message_database = new ajweb.data.Database(
    {
      id: "message_database",
      tablename: "chat",
      url: "dbservlet",
      properties: ["user_name", "message", "posted"]
    }
  );
}

function tearDown(){
  ajweb.databases = [];
}

function testInsert() {
}
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

