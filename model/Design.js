const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uiImageSchema = new Schema({
    priority: {
        type: Number
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
        required: false
    },
    key: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
    fa_description: {
        type: String,
        required: true
    },
    en_description: {
        type: String,
        required: true
    },
    deu_description: {
        type: String,
        required: false
    },
    images: {
        type: [uiImageSchema]
    },
    fa_metatag_title: {
        type: String,
        required: true
    },
    en_metatag_title: {
        type: String,
        required: true
    },
    fa_metatag_description: {
        type: String,
        required: true
    },
    en_metatag_description: {
        type: String,
        required: true
    }

})

module.exports = {
    Design: mongoose.model("Design", designSchema),
    UiImage: mongoose.model("UiImage", uiImageSchema)
};