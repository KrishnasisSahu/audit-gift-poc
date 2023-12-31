const {createPool} = require("mysql");
const util = require('util');

const pool = createPool({

    port : 3306,

    connectionLimit: 1,

    host: "localhost",
  
    user: "root",
  
    password: "",
  
    database: "blockchain_audit_trail"
  
  });

  pool.getConnection((err, connection) => {

    if (err) {
  
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
  
        console.error('Database connection was closed.')
  
      }
  
      if (err.code === 'ER_CON_COUNT_ERROR') {
  
        console.error('Database has too many connections.')
  
      }
  
      if (err.code === 'ECONNREFUSED') {
  
        console.error('Database connection was refused.')
  
      }
  
    }
  
  
  
  
    if (connection) connection.release()
  
    return
  
  })
  
  
  
  
  // Promisify for Node.js async/await.
  
  pool.query = util.promisify(pool.query)

  module.exports  =  
     pool;