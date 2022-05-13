const express = require('express');
const app = express();
const apiRoute = require('../../routes/api');
const version = 'v1/';
const user = 'admin';
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
var rfs = require('rotating-file-stream') // version 2.x
const path = require('path')

// SETUP LOGGER
// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../../log')
})
app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors());
app.use(express.static(path.join(__dirname, '../../public'))); //  
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 1000000
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use('/' + version + user, apiRoute); 
app.use((req, res) => {
    res.status(404).json({ success: 0, message: "Page is not found" });
});

module.exports = { app };