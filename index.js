var JDBC = require("jdbc");
var jinst = require("jdbc/lib/jinst");

if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath([""]);
}

var config = {
  url: "",
  drivername: "com.ibm.as400.access.AS400JDBCDriver",
  minpoolsize: 1,
  maxpoolsize: 100,
  user: "",
  password: "",
  properties: {},
};

var sforcesqldb = new JDBC(config);

sforcesqldb.initialize(function (err) {
  if (err) {
    console.log(err);
  }
});

sforcesqldb.reserve(function (err, connObjs) {
  var conn = connObjs.conn;

  conn.createStatement(function (err, statement) {
    if (err) {
      console.log(err);
    } else {
      statement.executeQuery(
        "SELECT * FROM HCRMFIL.FBES LIMIT 1",
        function (err, resultset) {
          if (err) {
            console.log(err);
          } else {
            resultset.toObjArray(function (err, results) {
              if (results.length > 0) {
                console.log("ID: " + JSON.stringify(results));
              }
            });
          }
        }
      );
    }
  });
});
