const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const technologySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    }
});

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        required: false

    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: false,
    },
    logoUrl: {
        type: String,
        required: false
    },
    logoAlt: {
        type: String,
        required: false
    },
    techDescription: {
        type: String,
        required: true,
    },
    technologies: {
        type: [technologySchema],
        default: [],
    },
});

module.exports = mongoose.model("Project", projectSchema);