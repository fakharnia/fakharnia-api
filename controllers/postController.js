const { objectValidation } = require("../extensions/objectValidation");
const path = require("path");
const fs = require("fs");
const formidable = require('formidable');
const mongoose = require('mongoose');
const Post = require("../model/Post");
const { uploadFileSync, removeFilesSync } = require("../extensions/uploadExtensions");

const postValidation = async (data) => {
    try {
        let result = true;
        if (data.fa_title === null || data.fa_title === undefined || data.fa_title.length === 0) {
            result = false;
        }
        if (data.en_title === null || data.en_title === undefined || data.en_title.length === 0) {
            result = false;
        }
        if (data.deu_title === null || data.deu_title === undefined || data.deu_title.length === 0) {
            result = false;
        }
        if (data.en_fileUrl === null || data.en_fileUrl === undefined || data.en_fileUrl.length === 0) {
            result = false;
        }
        if (data.fa_fileUrl === null || data.fa_fileUrl === undefined || data.fa_fileUrl.length === 0) {
            result = false;
        }
        if (data.coverUrl === null || data.coverUrl === undefined || data.coverUrl.length === 0) {
            result = false;
        }
        if (data.tags === null || data.tags === undefined || data.tags.length === 0) {
            result = false;
        }
        return result;

    } catch (error) {
        return false;
    }
}

const getRecentPosts = async (req, res) => {
    try {
        const posts = await Post.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(2).exec();
        res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getPost = async (req, res) => {
    try {
        const id = req.query.id;
        if (id) {
            const post = await Post.findOne({ _id: id });
            return res.status(200).json(post);
        } else {
            res.status(204).json();
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ deletedAt: null }).sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json(error);
    }
}


const createPost = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
            allowEmptyFiles: true
        });
        const [fields, files] = await form.parse(req);
        const model = objectValidation(fields);

        if (postValidation(model)) {
            let postId = new mongoose.Types.ObjectId();
            let pathForPost = path.join("public", "post", postId.toString());

            // update if the directory already exist
            while (fs.existsSync(pathForPost)) {
                postId = new mongoose.Types.ObjectId();
                pathForPost = path.join("public", "post", postId);
            }
            const fa_fileName = await uploadFileSync(files, "fa_file", `post/${postId}`);
            const en_fileName = await uploadFileSync(files, "en_file", `post/${postId}`);
            const deu_fileName = await uploadFileSync(files, "deu_file", `post/${postId}`);
            const coverName = await uploadFileSync(files, "cover", `post/${postId}`);

            // calculate estimated time of article here...
            const estimateTimeInMinutes = 10;


            await Post.create({
                _id: postId,
                fa_title: model.fa_title,
                en_title: model.en_title,
                deu_title: model.deu_title,
                fa_fileUrl: fa_fileName ?? null,
                en_fileUrl: en_fileName ?? null,
                deu_fileUrl: deu_fileName ?? null,
                coverUrl: coverName ?? null,
                coverAlt: model.coverAlt,
                estimateTimeInMinutes: estimateTimeInMinutes,
                tags: model.tags
            });

            return res.status(200).json({ message: "Successful" });
        }

        return res.status(500).json({ message: "Model validation failed!" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updatePost = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
        });
        const [fields, files] = await form.parse(req);
        const model = objectValidation(fields);

        if (postValidation(model)) {

            if (model.fa_fileChanged) {
                model.fa_fileUrl = await uploadFileSync(files, "fa_file", `post/${model._id}`);
            }
            if (model.en_fileChanged) {
                model.en_fileUrl = await uploadFileSync(files, "en_file", `post/${model._id}`);
            }
            if (model.deu_fileChanged) {
                model.deu_fileUrl = await uploadFileSync(files, "deu_file", `post/${model._id}`);
            }
            if (model.coverChanged) {
                model.coverUrl = await uploadFileSync(files, "cover", `post/${model._id}`);
            }

            // calculate estimated time of article here...
            const estimateTimeInMinutes = 10;

            await Post.findOneAndUpdate(
                { _id: model._id },
                {
                    $set: {
                        fa_title: model.fa_title,
                        en_title: model.en_title,
                        deu_title: model.deu_title,
                        fa_fileUrl: model.fa_fileUrl ?? null,
                        en_fileUrl: model.en_fileUrl ?? null,
                        deu_fileUrl: model.deu_fileUrl ?? null,
                        coverUrl: model.coverUrl ?? null,
                        coverAlt: model.coverAlt,
                        estimateTimeInMinutes: estimateTimeInMinutes,
                        tags: model.tags
                    },
                },
                { new: true });

            return res.status(200).json({ message: "Successful" });
        }

        return res.status(500).json({ message: "Model validation failed!" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        if (postId) {
            await Post.findOneAndUpdate(
                { _id: postId },
                {
                    $set: {
                        deletedAt: new Date()
                    },
                },
                { new: true });
            // const post = await Post.findOne({ _id: postId });
            // const filePath = path.join('public', 'post', postId);
            // await removeFilesSync(filePath, true);
            // await Post.deleteOne({ _id: postId });
        }
        return res.status(200).json({ message: "Successfully deleted!" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { getRecentPosts, getPost, getPosts, createPost, updatePost, deletePost }