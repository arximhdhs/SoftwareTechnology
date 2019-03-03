
const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: String,
    lng: Number,
    lat: Number,
    withdrawn: { type: Boolean, default: false}
});

module.exports = mongoose.model('Shop', shopSchema);
