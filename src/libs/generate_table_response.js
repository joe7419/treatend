// 传入请求的 第几页，每页多少个元素 信息，返回查询的结果并自动拼接。
// const database = require('./database.js')
const sql = require('sql-query').Query();


function generate_table_response(current_page, record_count_per_page, table_name, query_list, where_clause, order_by, order_ASC, connection, general_callback) {
    connection.query(sql.select().from(table_name).where(where_clause).count().build(), (err, result) => {
        let total_record_count = result[0]['COUNT(*)'];
        let total_page = Math.ceil(total_record_count / record_count_per_page)
        let start = (current_page - 1) * record_count_per_page // 从1开始编页码
        let query_str = ''
        let end;
        if (current_page === total_page) {
            end = total_record_count
        } else {
            end = current_page * record_count_per_page
        }
        if (order_by) {
            query_str = sql.select().from(table_name).select(query_list).where(where_clause).order(order_by, order_ASC ? 'A' : 'Z').limit([start, record_count_per_page]).build();
        } else {
            query_str = sql.select().from(table_name).select(query_list).where(where_clause).limit([start, record_count_per_page]).build();
        }
        connection.query(query_str, (err, result) => {
                let returned_data = {
                    "links": {
                        "pagination": {
                            "total": total_record_count,
                            "per_page": record_count_per_page,
                            "current_page": current_page,
                            "last_page": total_page,
                            "next_page_url": "",
                            "prev_page_url": "",
                            "from": start,
                            "to": end,
                        }
                    },
                    "data": result
                }
                if (err) console.error(err)
                general_callback(returned_data)
            }
        )
    })
}

module.exports = generate_table_response