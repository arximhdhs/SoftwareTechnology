const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    description: String,
    category: String,
    store: String,
    withdrawn: { type: Boolean, default: false},
    tags: [{type: String}],
    coordinates: {type: [Number], index: "2d"},
    lat: Number,
    lon: Number,
    count: {type: Number, default: 0},
    rate: {type: Number, default: 0}
});

module.exports = mongoose.model('Product', productSchema);
