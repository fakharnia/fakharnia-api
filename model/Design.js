const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uiImageSchema = new Schema({
    priority: {
        type: Number,
        required: true
    },
    fileAlt: {
        type: String
    },
    fileUrl: {
        type: String,
        required: true
    },
    isCover: {
        type: Boolean,
        required: true
    }
});

const designSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [uiImageSchema]
    }
})

module.exports = mongoose.model("Design", designSchema);