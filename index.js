var JDBC = require("jdbc");
var jinst = require("jdbc/lib/jinst");

let instanceConnection = null;

function DB2Initialize(configData) {
  return new Promise((resolve, reject) => {
    if (instanceConnection) reject("Connection already exists!");

    if (
      !configData ||
      !configData.url ||
      !configData.user ||
      !configData.password
    )
      reject("Config is invalid!");

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
      if (error) reject(error);
    });

    jdbc.reserve((error, connection) => {
      if (error) reject(error);

      instanceConnection = connection.conn;

      resolve(connection.conn);
    });
  });
}

async function DB2ExecuteQuery(query) {
  return new Promise((resolve, reject) => {
    if (!instanceConnection) reject("Connection not found!");

    instanceConnection.createStatement((error, statement) => {
      if (error) reject(error);

      statement.executeQuery(query, (error, resultSet) => {
        if (error) reject(error);

        resultSet.toObjArray(function (error, results) {
          if (error) reject(error);
          resolve(results);
        });
      });
    });
  });
}

async function DB2ExecuteQuery(query, callback) {
  if (!instanceConnection) callback("Instancia nao encontrada");

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
}

module.exports = {
  DB2Initialize,
  DB2ExecuteQuery,
};
