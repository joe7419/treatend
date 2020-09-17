const express = require('express')

let public_router = express.Router();

const get_disease_score_router = require('./front_get_disease_score')
const disease_info_router = require('./frontend_get_disease_info')
const disease_search_router = require('./disease_search')

public_router.use([get_disease_score_router, disease_info_router, disease_search_router]);

module.exports = public_router;