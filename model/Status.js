const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    fa_text: {
        type: String
    },
    en_text: {
        type: String
    },
    deu_text: {
        type: String
    },
    fa_status: {
        type: String
    },
    en_status: {
        type: String
    },
    deu_status: {
        type: String
    },
    state: {
        type: String
    },
    hasAvatar: {
        type: Boolean
    },
    avatarUrl: {
        type: String
    },
})

module.exports = mongoose.model("Status", statusSchema);