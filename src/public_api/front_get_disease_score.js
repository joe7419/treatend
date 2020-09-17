const sql = require('sql-query').Query();
const express = require('express')
const score_router = express.Router()

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}


function query_disease_score_list(symptom_id_list, connection, callback) {
    symptom_id_list.map(value => connection.escape(value))
    let symptom_list_string = symptom_id_list.join()
    let str_example =
        "SELECT zft_temp.p_id, ROUND(SUM(zft_temp.a_score_new),2) as zts, zp.p_title FROM `zft_temp` JOIN zft_program zp on zft_temp.p_id = zp.p_id WHERE `zft_temp`.ati_id in (" + symptom_list_string + ") GROUP BY p_id HAVING zts>0 ORDER BY zts DESC limit 30;"
    connection.query(str_example, callback)
}

// 为vue-multi-select设计。
score_router.get('/symptoms_list', (req, res) => {
    req.connection.query(
        'SELECT zft_article_title.ati_id as ati_id,zft_article_title.ati_title as ati_title,zft_article_title.ati_content as ati_content,za.att_name as att_name FROM zft_article_title JOIN zft_attr za on zft_article_title.att_id = za.att_id',
        (err, data) => {
            if (err) res.status(404).send({status: "error"})
            else {

                let sorted_data = groupBy(data, 'att_name');
                let response_list = [];
                Object.keys(sorted_data).forEach(key_val => {
                    sorted_data[key_val].forEach(val => {
                        delete val['att_name']
                        val.ati_content = val.ati_content.split('、').filter(val => val.length > 0)
                    });
                    response_list.push({
                        name: key_val,
                        list: sorted_data[key_val]
                    })
                })
                res.status(200).send(response_list)
            }
        }
    )
})

score_router.post('/disease_score', (req, res) => {
    query_disease_score_list(req.body, req.connection, (err, data) => {
        if (err) {
            res.status(500).send({status: 'error'})
            console.error(err)
        } else res.send(data)
    })
})

module.exports = score_router