const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');
// const mongooseAgregatePaginate = require('mongoose-aggregate-paginate-v2');
const CustomerSchema = require('../schema/customerSchema');

// UserSchema.plugin(mongoosePaginate);
// UserSchema.plugin(mongooseAgregatePaginate);

const Customer = mongoose.model('customer', CustomerSchema);

module.exports = Customer;
