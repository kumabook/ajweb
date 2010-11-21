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
  ajweb.data.sql.select("test_sql",
			function(results){
			  assertEquals(0, results.length);
			});
}


function testInsert(){
  ajweb.sql.insert("test_sql", properties, {name: "kumabook", message : "kumakuma"});
  ajweb.data.sql.select("test_sql", 
				     function(results){
				       assertEquals(3, results.length);
				       
				       assertEquals("kumabook", results[2].name);
				       assertEquals("kumakuma", results[2].message);

				     });
}

function testRemove(){

}

function testUpdate(){
  ajweb.data.sql.select("test_sql", 
			function(results){
			  assertEquals("hiroki", results[0].name);
			  assertEquals("hello", results[0].message);					
			  
			  ajweb.sql.update("test_sql", properties, {id : results[0].id, name :"熊本浩紀", message: "こんにちは!"});
			  
			  ajweb.data.sql.select("test_sql", function(results){
						  assertEquals("熊本浩紀", results[0].name);
						  assertEquals("こんにちは!", results[0].message);
						});
			});
  
}

function testSelect(){
  ajweb.data.sql.select("test_sql", 
			function(results){
			  assertEquals(2, results.length);
			  
			  assertEquals("hiroki", results[0].name);
			  assertEquals("hello", results[0].message);
			  
			  assertEquals("kumamoto", results[1].name);
			  assertEquals("こんにちは", results[1].message);
			});

}

function testDrop(){
  ajweb.sql.drop("test_sql");
  ajweb.data.sql.select("test_sql",
			function(results){
			  assertEquals(0, results.length);
			});
}
