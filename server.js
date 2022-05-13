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

const { app } = require("./src/config/app")

const { connectionDB } = require('~/src/config/mongodb');
connectionDB();




app.use(cookieParser());
const PORT = process.env.PORT || process.env.PORT;
app.listen(PORT, console.log(`Server started on port ${PORT}`))