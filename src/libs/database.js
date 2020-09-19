const mysql = require('mysql');

function create_connection(conf, callback) {
    const connection = mysql.createPool(conf)
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            process.kill(process.pid)
        }
    })
    callback(connection)
}


module.exports = {create_connection}