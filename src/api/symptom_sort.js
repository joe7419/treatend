const express = require('express')
const generate_table_response = require("../libs/generate_table_response");
const update_insert_operation = require("../libs/update_insert");

const symptom_sort_router = express.Router()

symptom_sort_router.get('/symptom_sort', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let per_page = parseInt(req.query.per_page) || 20;
    generate_table_response(page, per_page, "zft_attr",
        ["att_id", "att_name", "att_sort", "att_status"], {}, null, false, req.connection, (result) => {
            res.send(result)
        })
})
symptom_sort_router.post('/symptom_sort/new', (req, res) => {
    update_insert_operation.insert_one(req.body, "zft_attr", req.connection, (err) => {
        if (err) res.status(404).send({status: "error"})
        else res.status(200).send({status: "successful"})
    })
});
symptom_sort_router.post('/symptom_sort/update/:att_id', (req, res) => {
    update_insert_operation.update_by_id({att_id: parseInt(req.params.att_id)}, req.body, "zft_attr", req.connection, (err) => {
        if (err) res.status(404).send({status: "error"})
        else res.status(200).send({status: "successful"})
    })
});
symptom_sort_router.post('/symptom_sort/delete', (req, res) => {
    update_insert_operation.delete_one({att_id: req.body.att_id}, "zft_attr", req.connection, (err) => {
        if (err) res.status(404).send({status: "error"})
        else res.status(200).send({status: "successful"})
    })
})

module.exports = symptom_sort_router