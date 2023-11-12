const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    title: {
        type: String
    },
    priority: {
        type: Number
    },
    content: {
        type: String
    },
    coverUrl: {
        type: String
    },
    coverAlt: {
        type: String
    }

})

module.exports = mongoose.model("Service", serviceSchema);