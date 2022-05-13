const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');
// const mongooseAgregatePaginate = require('mongoose-aggregate-paginate-v2');
const UserSchema = require('../schema/userSchema');

// UserSchema.plugin(mongoosePaginate);
// UserSchema.plugin(mongooseAgregatePaginate);

const User = mongoose.model('user', UserSchema);

module.exports = User;
