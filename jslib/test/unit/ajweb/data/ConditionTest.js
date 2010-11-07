
dojo.require("ajweb.data.Condition");
dojo.require("ajweb.data.Database");

var room_database;
var message_database;
var condition1;
var condition2;
var condition3;
var condition4;
var and;
var or;
var not;

function setUp(){
  room_database  = new ajweb.data.Database(
    {
      id: "room_database",
      tablename: "room_database",
      url: "dbservlet",
      properties: ["name"]
    }
  );

  message_database = new ajweb.data.Database(
    {
      id: "message_database",
      tablename: "message_database",
      url: "dbservlet",
      properties: ["user_name", "message", "posted"]
    }
  );

  condition1 = new ajweb.data.Condition({op: "eq", left: new ajweb.data.Item({database: room_database, property: "name"}), right: '1'});
  condition2 = new ajweb.data.Condition({op: "eq", left: new ajweb.data.Item({database: message_database, property: "user_name"}), right: '"kumamoto"'});
  and = new ajweb.data.Conditions({op: "and", left: condition1, right: condition2});
  or = new ajweb.data.Conditions({op: "or", left: condition1, right: condition2});
  not = new ajweb.data.Conditions({op: "not", operand: condition1});

  condition3 = new ajweb.data.Condition({op: "eq", left: '1' , right: '2'});
  condition4 = new ajweb.data.Condition({op: "eq", left: '"test"' , right: '"test"'});

}

function tearDown(){
  ajweb.databases = [];
}

function testToJSON(){
  info("testToJSON");

  assertEquals(ajweb.toJSON(condition1.toJSON()),
	       ajweb.toJSON({op: "eq", property: "name", value: 1})
	      );
  assertEquals(ajweb.toJSON(condition2.toJSON()),
	       ajweb.toJSON({op: "eq", property: "user_name", value: "kumamoto"})
	      );
  assertEquals(ajweb.toJSON(and.toJSON()),
	       ajweb.toJSON(
		 {
		   op: "and",
		   left: {op: "eq", property: "name", value: 1},
		   right: {op: "eq", property: "user_name", value: "kumamoto"}
		 }
	       )
	      );
  assertEquals(ajweb.toJSON(or.toJSON()),
	       ajweb.toJSON({
		 op: "or",
		 left: {op: "eq", property: "name", value: 1},
		 right: {op: "eq", property: "user_name", value: "kumamoto"}
	       })
	      );
  assertEquals(ajweb.toJSON(not.toJSON()),
	       ajweb.toJSON({op: "not", operand: {op: "eq", property: "name", value: 1}})
	      );
};

function testEvaluate(){
  assertFalse(condition3.evaluate());
  assertTrue(condition4.evaluate());
  var and = new ajweb.data.Conditions({op: "and", left: condition3, right: condition4});
  var or = new ajweb.data.Conditions({op: "or", left: condition3, right: condition4});
  var not = new ajweb.data.Conditions({op: "not", operand : condition3});
  assertFalse(and.evaluate());
  assertTrue(or.evaluate());
  assertTrue(not.evaluate());

  condition3.setLeft(2);
  assertTrue(condition3.evaluate());

  condition4.setRight('"test1"');
  assertFalse(condition4.evaluate());

}

function testIsContainDatabaseItem(){

  assertTrue(condition1.isContainDatabaseItem());
  assertTrue(condition2.isContainDatabaseItem());
  assertFalse(condition3.isContainDatabaseItem());
  assertFalse(condition4.isContainDatabaseItem());

  assertTrue(and.isContainDatabaseItem());
  assertTrue(or.isContainDatabaseItem());
  assertTrue(not.isContainDatabaseItem());

  and = new ajweb.data.Conditions({op: "and", left: condition1, right: condition3});
  or = new ajweb.data.Conditions({op: "or", left: condition1, right: condition3});
  not = new ajweb.data.Conditions({op: "not", operand : condition3});

  assertTrue(and.isContainDatabaseItem());
  assertFalse(or.isContainDatabaseItem());
  assertFalse(not.isContainDatabaseItem());

  and = new ajweb.data.Conditions({op: "and", left: condition3, right: condition4});
  or = new ajweb.data.Conditions({op: "or", left: condition3, right: condition4});

  assertFalse(and.isContainDatabaseItem());
  assertFalse(or.isContainDatabaseItem());
}

function testToJSONConditions(){
  room_database.addCondition(condition1);
  message_database.addCondition(condition2);

  assertEquals(ajweb.databases.length, 2);
  assertEquals(ajweb.databases[0].tablename, "room_database");
  assertEquals(ajweb.databases[1].tablename, "message_database");
  assertEquals(ajweb.databases[0].conditions.length, 1);
  assertEquals(ajweb.databases[1].conditions.length, 1);


  assertEquals(ajweb.data.toJSONConditions(),
    ajweb.toJSON({
		   room_database: [{op: "eq", property: "name", value: 1}],
		   message_database: [{op: "eq", property: "user_name", value: "kumamoto"}]
		 })
    );

  and = new ajweb.data.Conditions({op: "and", left: condition1, right: condition1});
  or = new ajweb.data.Conditions({op: "or", left: condition1, right: condition1});

  room_database.addCondition(and);
  message_database.addCondition(or);


  assertEquals(ajweb.databases[0].conditions.length, 2);
  assertEquals(ajweb.databases[1].conditions.length, 2);

  assertEquals(ajweb.data.toJSONConditions(),
    ajweb.toJSON({
		   room_database: [
		     {op: "eq", property: "name", value: 1},
		     {op: "and",
		       left: {op: "eq", property: "name", value: 1},
		       right: {op: "eq", property: "name", value: 1}
		     }
		   ],
		   message_database: [
		     {op: "eq", property: "user_name", value: "kumamoto"},
		     {op: "or",
		       left: {op: "eq", property: "name", value: 1},
		       right: {op: "eq", property: "name", value: 1}
		     }
		   ]
		 })
    );

  var and_ = new ajweb.data.Conditions({op: "and", left: condition1, right: condition3});
  var or_ = new ajweb.data.Conditions({op: "or", left: condition1, right: condition3});

  room_database.addCondition(and_);
  message_database.addCondition(or_);

  assertEquals(ajweb.databases[0].conditions.length, 3);
  assertEquals(ajweb.databases[1].conditions.length, 3);

  assertEquals(ajweb.data.toJSONConditions(),
  ajweb.toJSON({
		 room_database: [
		     {op: "eq", property: "name", value: 1},
		     {op: "and",
		       left: {op: "eq", property: "name", value: 1},
		       right: {op: "eq", property: "name", value: 1}
		     },
		     {op: "eq", property: "name", value: 1}
		   ],
		   message_database: [
		     {op: "eq", property: "user_name", value: "kumamoto"},
		     {op: "or",
		       left: {op: "eq", property: "name", value: 1},
		       right: {op: "eq", property: "name", value: 1}
		     }
		   ]
		 })
    );

}

