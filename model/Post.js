const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    createdAt: {
        type: Date,
    },
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: [String]
    },
    confirmed: {
        type: Date
    }
}, {
    timestamps: true
});

commentSchema.pre("save", function (next) {

    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
})

const viewSchema = new Schema({
    createdAt: {
        type: Date,
    },
    ip: {
        type: String,
    }
});

viewSchema.pre("save", function (next) {

    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
})

const postSchema = new Schema({
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
    createdAt: {
        type: Date
    },
    updateAt: {
        type: Date
    },
    deletedAt: {
        type: Date,
        default: null
    },
    coverUrl: {
        type: String,
        required: true
    },
    coverAlt: {
        type: String
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
        type: String
    },
    estimateTimeInMinutes: {
        type: Number
    },
    tags: {
        type: [String],
        required: true
    },
    Views: {
        type: [viewSchema]
    },
    Shares: {
        type: [String]
    },
    Comments: {
        type: [commentSchema]
    }

}, {
    timestamps: true
})

postSchema.pre("save", function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
})

module.exports = mongoose.model("Post", postSchema);