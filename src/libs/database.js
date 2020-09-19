const mysql = require('mysql');

function create_connection() {
    const pool = mysql.createPool({
        connectionLimit : 10,
        host: 'us-cdbr-east-02.cleardb.comyour host',
        user:'b3d9ccad29aa7e',
        password:'b1817360',
        database:'heroku_2ae8333a90f6be8',    
      });
       
      pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
      });
}


module.exports = {create_connection}