const mongoose = require('mongoose');

const connection = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${ process.env.MONGO_HOST }:${ process.env.MONGO_PORT }/${ process.env.MONGO_DB }`;
// const connection = `mongodb://mongadev@45.64.98.133:27017/?authSource=monga`;
// const connection = `mongodb://mongadev:y%40f1RaM0nG4@45.64.98.133:27017/monga`;
mongoose.connect(connection);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB is ready.', new Date());
});

module.exports = db;