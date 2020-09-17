const express = require('express')

let login_router = express.Router();

login_router.post('/login', (req, res) => {
    if (req.body.username === 'admin' && req.body.password === '123456')
        // 7天有效期
        res.cookie('JSESSIONID', 'AE2EC34DFB==',{maxAge:604800000}).send({status: 'successful'});
    else if (req.cookies['JSESSIONID'] === 'AE2EC34DFB==')
        req.send({status: 'successful', username: 'admin'})
    else
        res.status(200).send({status: 'failed'})
})

module.exports = login_router;