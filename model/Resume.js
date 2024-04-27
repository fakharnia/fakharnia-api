const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: Number
    },
    iconClass: {
        type: String
    },
    fileAlt: {
        type: String
    },
    fileUrl: {
        type: String,
        required: true
    },
    rate: {
        type: Number
    }
});

const contactSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    iconClass: {
        type:String,
        required: true
    },
    priority: {
        type: Number
    }
});

const resumeSchema = new Schema({
    fa_aboutMe: {
        type: String,
        required: true
    },
    en_aboutMe: {
        type: String,
        required: true
    },
    deu_aboutMe: {
        type: String,
        required: false
    },
    fa_text: {
        type: String,
        required: true
    },
    en_text: {
        type: String,
        required: true
    },
    deu_text: {
        type: String,
        required: false
    },
    fileUrl: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    },
    contacts: {
        type: [contactSchema]
    },
    skills: {
        type: [skillSchema]
    }
})

module.exports = mongoose.model("Resume", resumeSchema);