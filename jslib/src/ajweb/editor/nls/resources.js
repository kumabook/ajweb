({
   toolboxItems:
   [
     {
       id:"Widgets", name:"Widgets",
       children: [{id:'label', name:'label'},{id:'button', name:'button'},
		  {id:'textbox', name:'textbox'},{id:'passwordbox', name:'passwordbox'},
		  {id:'selectbox', name:'selectbox'},
		  {id:'table', name:'table'},{id:'th', name:'th'},
		  {id:'panel', name:'panel'},{id:'frame', name:'frame'}]
     },
     {
       id: "DB",  name: "DB",
       children: [{id: "database", name: "database"},
		  {id: "property", name: "property"}]
     },
     {
       id: "Event", name: "Event",
       children: [
	 {id: "branch", name: "branch"},
	 {id: "condition", name: "condition"},
	 {id: "action", name: "Action",
	   children: [
	     {id: "login", name: "login"},{id: "insert", name: "insert"},
	     {id: "update", name: "update"}, {id: "delete", name: "delete"},
	     {id: "call", name: "call"}
	     ]
	 }
       ]
     }
   ],
   dataTypes: [
     {id: "ajweb.int", name: "int" }, {id: "ajweb.string", name: "string" },
     {id: "ajweb.password", name: "password" },{id: "ajweb.date", name: "date" },
     {id: "ajweb.time", name: "time"},{id: "ajweb.datetime", name: "datetime"}
   ],
   conditionOperators:  [
     {id: "true", name: "true"},{id : "and", name: "and"}, {id: "or", name: "or" },
     {id: "not", name: "not"}, {id: "eq", name: "equals"},{id: "gt", name: "greater than"},
     {id: "lt", name: "less than"}, {id: "success", name: "isSuccess"}
   ],
   file: "File",
   "new": "New",
   open: "Open File",
   save: "Save and Download",
   generate: "Generate",
   war: "Application Archive File (.war)",
   projectExploer: "projectExploer",
   toolbox: "toolbox",
   loadFile: "Load File",
   load: "load",
   newApplication: "New Application",
   create: "create",
   property: "property",
   event: "event",
   log: "log",
   databases: "databases",
   appName : "application name",
   contextMenu : "context menu",
   dropFunction: "drop area(event)",
   dropCondition: "<br/>&nbsp;drop area(condition)",
   condition: "譚｡莉ｶ",
   conditionSelect: "condition: ",
   undefinedElem: "unconfigured",
   enter: "enter",
   databaseName: "database name: ",
   initItems: "init items",
   initItem: "init item",
   add: "add",
   change: "change",
   select: "select",
   elementSelect: "element: ",
   methodSelect: "method: ",
   login: "login",
   param: "param",
   noElement: "no element",
   addEvent: "add event",
   databases: "databases",
   events: "events",
   interfaces: "UI"
})