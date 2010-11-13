dojo.require("ajweb.data.Condition");
dojo.require("ajweb.data.LocalDatabase");

function testCreate() {
/*  var db;

  try {
    if (window.openDatabase) {
      db = window.openDatabase("sampledb", "1.0", "Sample Database", "1048576");
      if (!db) {
        alert("データベースストレージが使えません。");
      }
      else{
        alert('db ok');
      }
    } else {
      alert("データベースストレージはサポートされていません。");
    }
  } catch (error) {
    // ...
  }

// select
db.transaction(
    function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS AddressList(name TEXT, address TEXT)');
        var id = 12113;
        var name = 'ziddy';
        tx.executeSql("INSERT INTO AddressList VALUES (?, ?)", [id,name] ,
            function(tx, rs) {
                alert(rs.insertId);
//                var dumper = new JKL.Dumper();
  //              alert( dumper.dump( rs ) );
            }
        );
    },
    function(error) {
        alert( 'transaction error : ' + error.message);
      }
);
*/
}
function testDrop() {
}
function testInsert() {
}
function testUpdate() {
}
function testFetch() {
}
function testRemove() {
}
function testSelect() {
}
