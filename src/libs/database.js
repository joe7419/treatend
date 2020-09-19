var mysql = require("mysql");
var pool = mysql.createPool({
  host: 'us-cdbr-east-02.cleardb.com',
  user:'b3d9ccad29aa7e',
  password:'b1817360',
  database:'heroku_2ae8333a90f6be8',
  connectionLimit : 10, // 可以自己設定
});

var create_connection = function(sql, options, callback) {
    console.log(sql, options, callback);
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    pool.getConnection(function(err, conn){
        if (err) {
            callback(err, null, null);
        } else {
            conn.create_connection(sql, options, function(err, results, fields){
                // callback
                callback(err, results, fields);
            });
            // release connection。
            // 要注意的是，connection 的釋放需要在此 release，而不能在 callback 中 release
            conn.release();
        }
    });
};



module.exports = {create_connection}