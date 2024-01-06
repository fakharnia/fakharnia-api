const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const technologySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    fa_description: {
        type: String,
        required: false,
    },
    en_description: {
        type: String,
        required: false,
    },
    deu_description: {
        type: String,
        required: false,
    }
});

const projectSchema = new Schema({
    fa_name: {
        type: String,
        required: true,
    },
    en_name: {
        type: String,
        required: true,
    },
    deu_name: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        required: false

    },
    fa_description: {
        type: String,
        required: true,
    },
    en_description: {
        type: String,
        required: true,
    },
    deu_description: {
        type: String,
        required: true,
    },
    url: {
        type: String
    },
    logoUrl: {
        type: String,
        required: false
    },
    logoAlt: {
        type: String
    },
    fa_techDescription: {
        type: String,
        required: true,
    },
    en_techDescription: {
        type: String,
        required: true,
    },
    deu_techDescription: {
        type: String,
        required: true,
    },
    technologies: {
        type: [technologySchema],
        default: [],
    },
});

module.exports = mongoose.model("Project", projectSchema);