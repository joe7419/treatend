const mysql = require('mysql');

function create_connection() {
    const pool = mysql.createPool(conf)
    pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
      });
}


  

module.exports = {create_connection}