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
    fileAlt: {
        type: String
    },
    fileUrl: {
        type: String,
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
    fileAlt: {
        type: String
    },
    fileUrl: {
        type: String,
        required: true
    },
    priority: {
        type: Number
    }
});

const languageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    speakingRate: {
        type: Number,
        required: true
    },
    readingRate: {
        type: Number,
        required: true
    },
    writingRate: {
        type: Number,
        required: true
    },
    listeningRate: {
        type: Number,
        required: true
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
        required: true
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
        required: true
    },
    fa_education: {
        type: String,
        required: true
    },
    en_education: {
        type: String,
        required: true
    },
    deu_education: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    },
    fa_hobbies: {
        type: String
    },
    en_hobbies: {
        type: String
    },
    deu_hobbies: {
        type: String
    },
    contacts: {
        type: [contactSchema]
    },
    languages: {
        type: [languageSchema]
    },
    skills: {
        type: [skillSchema]
    }
})

module.exports = mongoose.model("Resume", resumeSchema);