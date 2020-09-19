// const express = require('express')
// const config = require('./conf.json')
// const database = require('./src/libs/database.js')
// const bodyParser = require('body-parser')
// const morgan = require('morgan')
// const case_router = require('./src/api')
// const public_router = require('./src/public_api')
// const cookieParser = require('cookie-parser')
// const path = require('path');
// const compression = require('compression');
// const login_router = require('./src/login')


// const app = express()

// app.use(bodyParser.json())
// app.use(compression({level:9,memLevel:9}))

// app.use(express.static('dist'))

// // 所有不以api开头的请求都会被代理到index.html上，才会被正确的渲染。
// app.get(/^(?!\/api).*$/, (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/index.html'));
// })

// app.use(cookieParser())
// // app.use(morgan('combined'))
// database.create_connection(config.mysql, (connection) => {
//     app.use('/api',login_router);

//     app.use((req, res, next) => {
//         req.connection = connection
//         next()
//     });

//     app.use('/api/public',public_router);

//     app.use((req, res, next) => {
//         if (req.cookies.JSESSIONID === 'AE2EC34DFB==') next()
//         else res.status(401).end()
//     })

//     app.use('/api', case_router)

//     app.listen(process.env.PORT || 8080 , () => {
//         //console.log(`server starting at ${config.host}:${config.port}`)
//         console.log(`server starting at 127.0.0.1:8080`)
//     })
// })

const express = require('express')
const config = require('./conf.json')
const database = require('./src/libs/database.js')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const case_router = require('./src/api')
const public_router = require('./src/public_api')
const cookieParser = require('cookie-parser')
const path = require('path');
const compression = require('compression');
const login_router = require('./src/login')


const app = express()

app.use(bodyParser.json())
app.use(compression({level:9,memLevel:9}))

app.use(express.static('dist'))

// 所有不以api开头的请求都会被代理到index.html上，才会被正确的渲染。
app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
})

app.use(cookieParser())
// app.use(morgan('combined'))
database.create_connection(config.mysql, (connection) => {
    app.use('/api',login_router);

    app.use((req, res, next) => {
        req.connection = connection
        next()
    });

    app.use('/api/public',public_router);

    app.use((req, res, next) => {
        if (req.cookies.JSESSIONID === 'AE2EC34DFB==') next()
        else res.status(401).end()
    })

    app.use('/api', case_router)

    app.listen(process.env.PORT || 8082 , () => {
        //console.log(`server starting at ${config.host}:${config.port}`)
        console.log(`server starting at 127.0.0.1:8082`)
    })
})

//MySQL连接断开时自动重连
var mysql = require('mysql');
var mysql_config = {
    host: 'us-cdbr-east-02.cleardb.com',
    user:'b3d9ccad29aa7e',
    password:'b1817360',
    database:'heroku_2ae8333a90f6be8'
};
function disconnect_handler() {
    let conn = mysql.createConnection(mysql_config);
     conn.connect(err => {
         (err) && setTimeout('disconnect_handler()', 2000);
     });
 
     conn.on('error', err => {
         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
             // db error 自动重连
             disconnect_handler();
         } else {
             throw err;
         }
     });
     exports.conn = conn;
 }
 
 exports.disconnect_handler =  disconnect_handler;
