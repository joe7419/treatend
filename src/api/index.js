const express = require('express')

let case_router = express.Router();
const case_dbase_router = require('./case_dbase');
const symptom_management_router = require('./symptom_management');
const symptom_sort_router = require('./symptom_sort');
const disease_management_router = require('./disease_management');

case_router.use([case_dbase_router, symptom_management_router, symptom_sort_router, disease_management_router])
module.exports = case_router