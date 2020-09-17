// id_object {lss_pid:14}  key value pair is {::::}
const sql = require('sql-query').Query();

function update_by_id(id_object, key_value_pair, table_name, connection, callback) {
    connection.query(
        sql.update().into(table_name).set(key_value_pair).where(id_object).build(),
        callback
    )
}

function insert_one(key_value_pair, table_name, connection, callback) {
    console.log(sql.insert().into(table_name).set(key_value_pair).build())
    connection.query(
        sql.insert().into(table_name).set(key_value_pair).build(),
        callback
    )
}

function delete_one(id_object, table_name, connection, callback) {
    connection.query(
        sql.remove().from(table_name).where(id_object).build(),
        callback
    )
}

module.exports = {update_by_id, insert_one, delete_one}