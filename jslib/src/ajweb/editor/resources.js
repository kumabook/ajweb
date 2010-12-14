dojo.provide("ajweb.editor.resources");

ajweb.editor.resources = {};
ajweb.editor.resources.locale = "ja";
ajweb.editor.resources.setLocale = function(locale){
  ajweb.editor.resources.locale = locale;
};
ajweb.editor.resources.getValue = function(key){
  return ajweb.editor.resources.texts[key][ajweb.editor.resources.locale];
};
ajweb.getValue = ajweb.editor.resources.getValue;


ajweb.editor.resources.texts = {
  file: {
    ja: "ファイル",
    en: "File"
  },
  "new": {//newは予約語
    ja: "新規作成",
    en: "New"
  },
  open: {
    ja: "開く",
    en: "Open File"
  },
  save: {
    ja: "保存してダウンロード",
    en: "Save and Download"
  },
  generate: {
    ja: "生成",
    en: "Generate"
  },
  war: {
    ja: "Application Archive File (warファイル)",
    en: "Application Archive File (.war)"
  },
  projectExploer: {
    ja: "プロジェクトエクスプローラ",
    en: "projectExploer"
  },
  toolbox: {
    ja: "ツールボックス",
    en: "toolbox"
  },
  loadFile: {
    ja: "ファイルの読み込み",
    en: "Load File"
  },
  load: {
    ja: "読み込み",
    en: "load"
  },
  newApplication: {
    ja: "新規アプリケーション",
    en: "New Application"
  },
  create: {
    ja: "作成",
    en: "create"
  },
  property: {
    ja: "プロパティ",
    en: "property"
  },
  event: {
    ja: "イベント",
    en: "event"
  },
  log: {
    ja: "ログ",
    en: "log"
  },
  databases: {
    ja: "データモデル",
    en: "databases"
  }
};
