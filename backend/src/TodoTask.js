const mongoose = require('mongoose');

const todoTaskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        default: null,
        required: false,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
    category: {
        type: String,
        required: false,
    }
})

module.exports = mongoose.model('TodoTask', todoTaskSchema);