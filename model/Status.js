const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    dailyText: {
        type: String
    },
    title: {
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