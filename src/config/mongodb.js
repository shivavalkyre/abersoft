const mongoose = require('mongoose');

const connectionDB = () => {
    const DB_HOST = process.env.MONGO_HOST;
    const DB_PORT = process.env.MONGO_PORT;
    const DB_NAME = process.env.MONGO_DB;
    const DB_USERNAME = process.env.MONGO_USER;
    const DB_PASSWORD = process.env.MONGO_PASS;
    const DB = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_NAME}`;

    mongoose.connect(DB);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB is ready.', new Date());
    });

    // mongoose.connect(DB, {
    //     useNewUrlParser: true,
    //     useCreateIndex: true,
    //     useFindAndModify: false
    // }).then(() => {
    //     console.log('DB conn successfully');
    // });
}

module.exports = { connectionDB };