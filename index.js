var JDBC = require("jdbc");
var jinst = require("jdbc/lib/jinst");

let instanceConnection = null;

function DB2Initialize(configData) {
  try {
    if (!jinst.isJvmCreated()) {
      jinst.addOption("-Xrs");
      jinst.setupClasspath(["./lib/jt400.jar"]);
    }

    const config = {
      url: configData.url,
      drivername: "com.ibm.as400.access.AS400JDBCDriver",
      minpoolsize: 1,
      maxpoolsize: 10,
      user: configData.user,
      password: configData.password,
    };

    const jdbc = new JDBC(config);

    jdbc.initialize((error) => {
      if (error) throw new Error(error);
    });

    jdbc.reserve((error, connection) => {
      if (error) throw new Error(error);

      instanceConnection = connection.conn;
    });
  } catch (error) {
    console.error(error);
  }
}

async function DB2ExecuteQuery(query, callback) {
  try {
    if (!instanceConnection) throw new Error("Connection not found!");

    instanceConnection.createStatement((error, statement) => {
      if (error) callback(error);

      statement.executeQuery(query, (error, resultSet) => {
        if (error) callback(error);

        resultSet.toObjArray(function (error, results) {
          if (error) callback(error);
          callback(null, results);
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  DB2Initialize,
  DB2ExecuteQuery,
};
