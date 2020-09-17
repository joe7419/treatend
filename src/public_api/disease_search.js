const search_in_body_sql = `SELECT p_id, p_title, concat(p_tedian,p_jiancha,p_zhiliao) AS whole
 FROM zft_program WHERE concat(p_tedian,p_jiancha,p_zhiliao) LIKE CONCAT("%",?,"%");`

const search_in_head_sql = `SELECT p_id, p_title, concat(p_tedian,p_jiancha,p_zhiliao) AS whole
 FROM zft_program WHERE p_title LIKE CONCAT("%",?,"%");`

function sql_query(mysqlConnection, queryString, queryValuesArray) {
    return new Promise(function (resolve, reject) {
        if (queryValuesArray) {
            mysqlConnection.query(queryString, queryValuesArray, function (err, data) {
                if (err !== null) reject(err);
                else resolve(data);
            });
        } else {
            mysqlConnection.query(queryString, function (err, data) {
                if (err !== null) reject(err);
                else resolve(data);
            });
        }
    });
}

function to_brief_block_and_calculate_content_times(long_text, search_string) {
    long_text = long_text.replace("\n","\u21b5")
    let text = long_text.match(".{0,20}" + search_string + ".{0,20}")[0]
    let count = [...long_text.matchAll(search_string)].length
    return {text, count}
}

const express = require('express')
const disease_search_router = express.Router()

// with title=, body= query
disease_search_router.get('/disease_search', (req, res) => {
    if (req.query.title)
        req.connection.query(
            `SELECT p_title FROM zft_program WHERE p_title LIKE CONCAT("%",?,"%");`, [req.query.title]
            , (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({status: 'error'})
                } else res.send(data)
            })
    else if (req.query.body) {
        let result_object_content = [];
        let result_object_title = []

        let query1 = sql_query(req.connection, search_in_body_sql, [req.query.body]).then(data => {
            // [{p_id,p_title,whole}]
            result_object_content = data.map(item => {
                let brief_text_and_times_count = to_brief_block_and_calculate_content_times(item.whole, req.query.body)
                //{text:"this is brief text", times:10}
                return {
                    p_id: item.p_id,
                    p_title: item.p_title,
                    text: brief_text_and_times_count.text,
                    count: brief_text_and_times_count.count
                }
            })
        })

        // [{p_id,p_title,whole}]
        let query2 = sql_query(req.connection, search_in_head_sql, [req.query.body]).then(data => {
            result_object_title = data.map(item => {
                return {
                    p_id: item.p_id,
                    p_title: item.p_title,
                    text: item.whole.substring(0, 40)
                }
            })
        })

        Promise.all([query1, query2]).then(() => {
            let final_result = []//最终发给客户端的 {p_title:"",text:"xxxx",score:20,p_id:10}
            result_object_content.forEach(findResult => {
                //{ p_id: item.p_id,p_title: item.p_title,text: ,count: }
                let r = result_object_title.find(x => x.p_id === findResult.p_id)
                let score = r ? findResult.count + 10: findResult.count // 如果标题中出现了疾病，则+10分。
                final_result.push({p_id: findResult.p_id, p_title: findResult.p_title, text: findResult.text, score: score})
            })

            result_object_title.forEach(findResult => {
                if (!result_object_content.find(x => x.p_id === findResult.p_id)) // 如果没有在content中找到和title对应的疾病，
                    // 说明搜索结果中只有标题里出现了关键词，那么记10分，采用标题的内容作为内容发送
                    final_result.push({p_id: findResult.p_id, p_title: findResult.p_title, text: findResult.text, score: 10})
            })

            final_result.sort((a, b) => a.score > b.score ? -1 : 1)
            res.send(final_result)
        })
    }
})

module.exports = disease_search_router