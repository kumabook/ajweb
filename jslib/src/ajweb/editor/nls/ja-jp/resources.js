({
   toolboxItems :
   [
     {
       id: "Widgets", name:"ウィジェット",
       children: [{id:'label', name:'ラベル'},{id:'button', name:'ボタン'},
		  {id:'textbox', name:'テキストボックス'},{id:'passwordbox', name:'パスワードボックス'},
		  {id:'selectbox', name:'セレクトボックス'},
		  {id:'table', name:'テーブル'},{id:'th', name:'テーブルヘッダ'},
		  {id:'panel', name:'パネル'},{id:'frame', name:'フレーム'}]
     },
     {
       id: "DB", name: "データベース",
       children: [{id: "database", name: "データベース"},
		  {id: "property", name: "プロパティ"}]
     },
     {
       id: "Event", name: "イベント",
       children: [
	 {id: "branch", name: "分岐"},
	 {id: "condition", name: "条件"},
	 {id: "action", name: "アクション",
	   children: [
	     {id: "login", name: "ログイン"},{id: "insert", name: "挿入"},
	     {id: "update", name: "更新"},{id: "delete", name: "削除"},
	     {id: "call", name: "呼び出し"}
	     ]
	  }
       ]
     }
   ],
   dataTypes: [
     {id: "ajweb.int", name: "整数" }, {id: "ajweb.string", name: "文字列" },
     {id: "ajweb.password", name: "パスワード" },{id: "ajweb.date", name: "日付" },
     {id: "ajweb.time", name: "時刻" },{id: "ajweb.datetime", name: "日付:時刻"}
   ],
   conditionOperators:  [
     {id: "true", name: "常に真"},{id : "and", name: "かつ"}, {id: "or", name: "または" },
     {id: "not", name: "否定"}, {id: "eq", name: "等しい"},{id: "gt", name: "より大きい"},
     {id: "lt", name: "より小さい"}, {id: "success", name: "成功したか"}
   ],
   file:  "ファイル",
   "new": "新規作成",
   open: "開く",
   save:  "保存してダウンロード",
   generate: "生成",
   war: "Application Archive File (warファイル)",
   projectExploer: "プロジェクトエクスプローラ",
   toolbox: "ツールボックス",
   loadFile: "ファイルの読み込み",
   load: "読み込み",
   newApplication: "新規アプリケーション",
   create: "作成",
   property: "プロパティ",
   event: "イベント",
   log: "ログ",
   databases: "データモデル",
   appName: "アプリ名",
   contextMenu : "コンテキストメニュー",
   dropFunction: "<br/>&nbsp;ドロップ領域(イベント)",
   dropCondition: "<br/>&nbsp;ドロップ領域(条件)",
   condition: "条件",
   conditionSelect: "条件: ",
   undefinedElem: "未設定",
   enter: "決定",
   databaseName: "データベース名:",
   initItems: "初期値",
   initItem: "初期値",
   add: "追加",
   change: "変更",
   select: "選択",
   elementSelect: "エレメント: ",
   methodSelect: "メソッド: ",
   login: "ログイン",
   param: "引数",
   noElement: "エレメントが選択されていません",
   addEvent: "イベントを追加",
   databases: "データモデル"
 })










