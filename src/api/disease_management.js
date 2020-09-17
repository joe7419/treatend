const express = require('express')
const generate_table_response = require("../libs/generate_table_response");
const generate_list_response = require("../libs/generate_list_response")
const update_insert = require('../libs/update_insert')
let disease_router = express.Router()

disease_router.get('/disease_management', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let per_page = parseInt(req.query.per_page) || 20;
    generate_table_response(page, per_page, "zft_program",
        ['p_id', 'p_title', 'p_sort'], {}, null, false, req.connection, (result) => {
            res.send(result)
        })
})

disease_router.get('/disease_management/:p_id', (req, res) => {
    generate_list_response("zft_program",
        ['p_tedian', 'p_jiancha', 'p_zhiliao', 'p_link'],
        {p_id: parseInt(req.params.p_id)},
        req.connection, (err, data) => {
            if (err) {
                console.error(err)
                res.status(404).send({status: 'failed'})
            } else {
                res.send(data[0])
            }
        })
})

// 这里只允许有p_title和p_sort字段。
disease_router.post('/disease_management/new', (req, res) => {
    let insert_object = {
        ...req.body, ...{
            p_tedian: '',
            p_jiancha: '',
            p_zhiliao: '',
            p_zz: '',
            p_link: '',
            p_att_id: 0,
            p_score_type: 0,
            p_age: 0,
            p_sex: 0,
            p_i_title: '',
            cas_pidsum: 0,
            cas_sum: 1000
        }
    }
    update_insert.insert_one(insert_object, 'zft_program', req.connection, (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).send({status: 'failed'})
        } else {
            res.send({status: 'successful'})
        }
    })
})

// 这里允许任何字段的post。
disease_router.post('/disease_management/update/:p_id', (req, res) => {
    update_insert.update_by_id({p_id: parseInt(req.params.p_id)}, req.body, 'zft_program', req.connection, (err, data) => {
        if (err) {
            console.error(err)
            res.status(404).send({status: 'failed'})
        } else {
            res.send({status: 'successful'})
        }
    })
})

disease_router.post('/disease_management/delete', (req, res) => {
    update_insert.delete_one({p_id: parseInt(req.body.p_id)}, 'zft_program', req.connection, (err, result) => {
        if (err) {
            console.error(err)
            res.status(404).send({status: 'failed'})
        } else {
            res.send({status: 'successful'})
        }
    })
})

disease_router.post('/disease_info/img/:i_pid/add', (req, res) => {
    req.body.i_pid = parseInt(req.params.i_pid)
    update_insert.insert_one(req.body,'zft_img',req.connection,(err,data) => {
        if (err) {
            console.error(err)
            res.status(404).send({status: 'failed'})
        } else {
            res.send({status: 'successful'})
        }
    })
})

// i_pid在这里并没有实际的作用
disease_router.post('/disease_info/img/:i_pid/delete', (req, res) => {
    update_insert.delete_one({i_id: req.body.i_id}, 'zft_img', req.connection, (err, data) => {
        if (err) {
            console.error(err)
            res.status(404).send({status: 'failed'})
        } else {
            res.send({status: 'successful'})
        }
    })
})

module.exports = disease_router