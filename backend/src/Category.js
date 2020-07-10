const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    category: {
        type: Array,
        required: true,
        default: [],
    },
})

module.exports = mongoose.model('Category', categorySchema);