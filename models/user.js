const mongoose = require('mongoose');
      passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, unique: true, required: true },
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
