const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    fa_title: {
        type: String,
        required: true
    },
    en_title: {
        type: String,
        required: true
    },
    deu_title: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
    fa_fileUrl: {
        type: String,
        required: true
    },
    en_fileUrl: {
        type: String,
        required: true
    },
    deu_fileUrl: {
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