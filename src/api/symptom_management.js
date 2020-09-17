const express = require('express')
const generate_table_response = require("../libs/generate_table_response");
const update_insert_operation = require("../libs/update_insert");
const generate_list_response = require('../libs/generate_list_response')

const symptom_management_router = express.Router()

symptom_management_router.get('/symptom_management', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let per_page = parseInt(req.query.per_page) || 20;
    generate_table_response(page, per_page, "zft_article_title",
        ["ati_id", "ati_title", "ati_content", "ati_zon"], {},null,false, req.connection,
        (result) => res.send(result)
    )
})

symptom_management_router.get('/symptom_management/:ati_id', (req, res) => {
    generate_list_response('zft_article_title', ["ati_title", "ati_content", 'att_id'],
        {ati_id: parseInt(req.params.ati_id)}, req.connection, (err, result) => {
            if (err) res.status(404).send({status: "error"})
            else res.status(200).send(result[0])
        }
    )
})

symptom_management_router.post('/symptom_management/new', (req, res) => {
    update_insert_operation.insert_one(req.body, "zft_article_title", req.connection, (err) => {
        if (err) res.status(404).send({status: "error"})
        else res.status(200).send({status: "successful"})
    })
});

symptom_management_router.post('/symptom_management/update/:ati_id', (req, res) => {
    update_insert_operation.update_by_id({ati_id: parseInt(req.params.ati_id)}, req.body, "zft_article_title", req.connection, (err) => {
        if (err) res.status(404).send({status: "error"})
        else res.status(200).send({status: "successful"})
    })
});
symptom_management_router.post('/symptom_management/delete', (req, res) => {
    update_insert_operation.delete_one({ati_id: req.body.ati_id}, "zft_article_title", req.connection, (err) => {
        if (err) res.status(404).send({status: "error"})
        else res.status(200).send({status: "successful"})
    })
})

module.exports = symptom_management_router