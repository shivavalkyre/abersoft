const mongoose = require('mongoose');
const timestamps = require('mongoose-unix-timestamp-plugin');
const { Schema } = mongoose;

const User = new Schema({
    email: { type: String },
    noPhone: { type: String },
    password: { type: String },
    role: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
    accessToken: { type: String },
    emailVerifiedAt: { type: Number, default: null },
}, {
    versionKey: false,
    // toJSON: { virtuals: true },
    // timestamps: {
    //     createdAt: 'createdAt',
    //     updatedAt: 'updatedAt',
    // }
})
User.plugin(timestamps);

module.exports = User;
