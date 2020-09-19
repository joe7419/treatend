const mysql = require('mysql');

function create_connection(conf, callback) {
    const connection = mysql.createPool(conf)
    callback(connection)
}

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
  
module.exports = {create_connection}