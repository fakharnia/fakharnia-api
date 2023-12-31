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
    description: {
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
    aboutMe: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    education: {
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
    hobbies: {
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