const sql = require('sql-query').Query();

function generate_list_response(db_name, query_list, where_clause, connection, general_callback) {
    connection.query(
        sql.select().from(db_name).select(query_list).where(where_clause).build(),
        general_callback
    )
}

module.exports = generate_list_response