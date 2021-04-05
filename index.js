const express = require('express')
const morgan =require('morgan')
const bodyParser = require("body-parser");
const cors = require('cors')
const http = require('http')
const https = require('https')
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

http.createServer(app).listen(5000, () => {
    console.log('server on 5000')
})

app.get('/', function(req, res){
    res.header("Access-Control-Allow-Origin", "*")
    res.send('hellow world')
})