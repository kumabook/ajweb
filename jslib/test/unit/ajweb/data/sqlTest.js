dojo.require("ajweb.data.sql");

var room_properties = ["name"];
var chat_properties = ["user_name", "message", "posted"];
var properties = ["name", "message"];


function setUp(){

  ajweb.sql.drop("test_sql");
  ajweb.sql.create("test_sql", properties);

  ajweb.sql.insert("test_sql", properties, {name: "hiroki", message : "hello"});
  ajweb.sql.insert("test_sql", properties, {name: "kumamoto", message: "こんにちは"});
}

function tearDown(){

}

function testCreate(){
  ajweb.sql.drop("test_sql");
  ajweb.sql.create("test_sql", properties);
  var result1 = ajweb.data.sql.select("test_sql");
  assertEquals(0, result1.length);
}

function testDrop(){

}

function testInsert(){
  ajweb.sql.insert("test_sql", properties, {name: "kumabook", message : "kumakuma"});
  var result1 = ajweb.data.sql.select("test_sql");
  assertEquals(3, result1.length);

//  assertEquals(3, result1[0].id);
  assertEquals("kumabook", result1[2].name);
  assertEquals("kumakuma", result1[2].message);

}

function testRemove(){

}

function testUpdate(){

  var result1 = ajweb.data.sql.select("test_sql");

//  assertEquals(1, result1[0].id);
  assertEquals("hiroki", result1[0].name);
  assertEquals("hello", result1[0].message);
  ajweb.sql.update("test_sql", properties, {id : result1[0].id, name :"熊本浩紀", message: "こんにちは!"});
  var result4 = ajweb.data.sql.select("test_sql");
//  assertEquals(2, result4[1].id);
  assertEquals("熊本浩紀", result4[0].name);
  assertEquals("こんにちは!", result4[0].message);

}

function testSelect(){
  var result1 = ajweb.data.sql.select("test_sql");

  assertEquals(2, result1.length);

// assertEquals(1, result1[0].id);
  assertEquals("hiroki", result1[0].name);
  assertEquals("hello", result1[0].message);


  var result2 = ajweb.data.sql.select("test_sql");
//  assertEquals(2, result2[1].id);
  assertEquals("kumamoto", result2[1].name);
  assertEquals("こんにちは", result2[1].message);

  var result3 = ajweb.data.sql.select("test_sql");
  assertEquals(2, result3.length);
}
