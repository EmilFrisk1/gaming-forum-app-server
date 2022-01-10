const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please enter an title'],
    },
    description: {
        type: String,
        required: [true, 'Please enter a description']
    },
    likeCount: {
        type: Number,
        required: false,
        default: 0
    },
    likeHistory: {
        type: [String],
        required: false
    }
}, { timestamps: true })

const Blog = mongoose.model('blog', blogSchema)
module.exports = Blog