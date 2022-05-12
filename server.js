// Node Package
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('module-alias/register');

const version = 'v1/';
const apiRoute = require('./routes/api');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
require('./database');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({
    limit: '50mb'
}));

app.get('/', function (req, res) {
    res.send('Hello Testing API')
});

// app.use('/'+version, function (req,res){
//     res.send('Hello Abersoft Api With Version')
// }); 

app.use('/'+version, apiRoute); //ex localhost:3002/api/merchant/get/list/1

app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Page is not found" });
});

app.use(cookieParser());
const PORT = process.env.PORT || process.env.PORT;
app.listen(PORT, console.log(`Server started on port ${PORT}`))