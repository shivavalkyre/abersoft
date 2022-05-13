const mongoose = require('mongoose');
const timestamps = require('mongoose-unix-timestamp-plugin');
const { Schema } = mongoose;


const Customers = new Schema({
    company: { type: String, require: true },
    projectManagers: { type: Array },
    workers: { type: Array },
    isActive: { type: Boolean, default: true },
}, {
    versionKey: false,
})
Orders.plugin(timestamps);
module.exports = Customers;