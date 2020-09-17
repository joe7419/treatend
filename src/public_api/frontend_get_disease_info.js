const sql = require('sql-query').Query();
const express = require('express')
const generate_list_response = require("../libs/generate_list_response");
const disease_info_router = express.Router()


disease_info_router.get('/case_dbase/symptom_temp_list/:p_id', (req, res) => {
    generate_list_response('zft_temp',
        ['conid', 'ati_id', 'ati_title', 'ati_content', 'a_score_new', 'a_score_per'],
        {p_id: parseInt(req.params.p_id)},
        req.connection, (err, data) => {
            res.send(data)
        }
    )
})

disease_info_router.get('/case_dbase/:p_id', (req, res) => {
    generate_list_response('zft_program',
        ['p_tedian', 'p_link', 'p_jiancha', 'p_zhiliao', 'p_zz'], {p_id: parseInt(req.params.p_id)}
        , req.connection, (err, data) => {
            if (err) {
                console.error(err)
                res.status(500).send({status: 'failed'})
            } else res.send(data[0])
        })
})

disease_info_router.get('/disease_info/img/:i_pid', (req, res) => {
    generate_list_response('zft_img', ['i_id', 'i_title', 'i_url'], {i_pid: parseInt(req.params.i_pid)}, req.connection, (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send({status: 'failed'})
        } else res.send(data)
    })
})

module.exports = disease_info_router