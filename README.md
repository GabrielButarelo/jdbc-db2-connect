# JDBC-DB2-CONNECT

Connector for connection with IBM's DB2 database that can be easily used for executing queries within Node.js

## How To Use

Install the library as a dependency in your project.
```node
npm install jdbc-db2-connect
```

Import the functions into your file.
```node
const { DB2Initialize, DB2ExecuteQuery } = require("jdbc-db2-connect");
```

Start the connection to the database by providing the URL, user, and password.
```node
DB2Initialize({
    url: "jdbc:as400://<server-ip>;naming=<name>;libraries=<libraries>",
    user: "<user>",
    password: "<password>",
});
```

Execute query and use the callback to get the error or the query result.
```node
DB2ExecuteQuery("<query>", function (erro, result) {});
```
