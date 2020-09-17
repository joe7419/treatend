const express = require('express')
const generate_table_response = require("../libs/generate_table_response");
const generate_list_response = require("../libs/generate_list_response")
const update_insert = require('../libs/update_insert')
let case_router = express.Router()

case_router.get('/case_dbase', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let per_page = parseInt(req.query.per_page) || 20;
    generate_table_response(page, per_page, "zft_program",
        ['p_id', 'p_title', 'cas_pidsum', 'p_age', 'p_sex'], {},null,false, req.connection, (result) => {
            res.send(result)
        })
})

case_router.get('/case_dbase/case_temp_list/:cas_pid', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let per_page = parseInt(req.query.per_page) || 20;
    generate_table_response(page, per_page, 'zft_cases',
        ['cas_id', 'cas_age', 'cas_sex'],
        {cas_pid: parseInt(req.params.cas_pid)},'cas_addtime',false, req.connection, (data) => {
            res.send(data)
        })
})



case_router.get('/case_dbase/case_temp_row/:cas_id', (req, res) => {
    generate_list_response('zft_cases',
        ['cas_age', 'cas_sex', 'cas_content', 'cas_po', 'cas_ne', 'cas_link'],
        {cas_id: parseInt(req.params.cas_id)},
        req.connection, (err, data) => {
            res.send(data[0])
        })
})


case_router.post('/case_dbase/case_temp_list/:cas_pid/new', (req, res) => {
    req.body.cas_pid = req.params.cas_pid;
    req.body.cas_addtime = Math.round((new Date).valueOf() / 1000);
    update_insert.insert_one(req.body, 'zft_cases', req.connection, (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).send({status: 'failed'})
        } else {
            res.send({status: 'successful'})
        }
    })
})

// 这个api里的cas_pid其实没啥用，但是还是象征性的加一下。
case_router.post('/case_dbase/case_temp_list/:cas_pid/update/:cas_id', (req, res) => {
    update_insert.update_by_id({cas_id: parseInt(req.params.cas_id)}, req.body, 'zft_cases', req.connection, (err, result) => {
        if (err) {
            console.error(err)
            res.status(404).send({status: 'failed'})
        } else {
            res.send({status: 'successful'})
        }
    })
})

// 同样道理，这个cas_pid也卵用没有，真正有用的还是body里的cas_id那个值。
case_router.post('/case_dbase/case_temp_list/:cas_pid/delete', (req, res) => {
    update_insert.delete_one({cas_id: parseInt(req.body.cas_id)}, 'zft_cases', req.connection, (err, result) => {
        if (err) {
            console.error(err)
            res.status(404).send({status: 'failed'})
        } else {
            res.send({status: 'successful'})
        }
    })
})

// 根据症状返回疾病列表
case_router.get('/case_dbase/symptom_related_disease/:ati_id', (req, res) => {
    req.connection.query(
        'SELECT zft_temp.p_id,zft_temp.a_score_new,zft_temp.a_score_per,zft_program.p_title FROM zft_temp INNER JOIN zft_program ON zft_temp.p_id=zft_program.p_id WHERE zft_temp.ati_id=? ORDER BY zft_temp.a_score_new DESC;'
        , parseInt(req.params.ati_id), (err, data) => {
            if (err) {
                console.error(err)
                res.status(404).send({status: 'failed'})
            } else {
                res.send({data})
            }
        })
})

module.exports = case_router