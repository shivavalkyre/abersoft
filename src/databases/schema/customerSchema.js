const mongoose = require('mongoose');
const timestamps = require('mongoose-unix-timestamp-plugin');
const { Schema } = mongoose;


const Customers = new Schema({
    company: { type: Array, require: true },
    projectManagers: { type: Array },
    workers: { type: Array },
    isActive: { type: Boolean, default: true },
}, {
    versionKey: false,
})
Customers.plugin(timestamps);
module.exports = Customers;