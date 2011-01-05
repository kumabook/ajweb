([
  {
    name:"UI",
    children: [{name:'label'},{name:'button'},{name:'textbox'},{name:'passwordbox'},{name:'selectbox'},{name:'table'},{name:'th'},{name:'panel'},{name:'frame'}]
  },
  {
    name: "DB",
    children: [{name: "database"},{name: "property"}]
  },
  {
  name: "Event",
    children: [
      {name: "condition"},
      {
	name: "Function",
	children: [{name: "login"},{name: "insert"},{name: "update"},{name: "delete"},{name: "call"}]
      }
    ]
  }

])