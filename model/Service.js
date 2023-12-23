const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    coverUrl: {
        type: String,
        required: true
    },
    coverAlt: {
        type: String
    }

})

module.exports = mongoose.model("Service", serviceSchema);