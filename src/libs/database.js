const mysql = require('mysql');

function create_connection(conf, callback) {
    const connection = mysql.createPool(conf)
    
}


  

module.exports = {create_connection}