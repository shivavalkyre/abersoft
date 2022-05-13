const mongoose = require('mongoose');

const connection = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${ process.env.MONGO_HOST }:${ process.env.MONGO_PORT }/${ process.env.MONGO_DB }`;
mongoose.connect(connection);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB is ready.', new Date());
});

module.exports = db;