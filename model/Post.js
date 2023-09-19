const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    Views: {
        type: [String]
    },
    estimateTime: {
        type: Number
    },
    tags: {
        type: [String]
    },
    cover: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Post", postSchema);