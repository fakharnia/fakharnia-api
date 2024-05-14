const { objectValidation } = require("../extensions/objectValidation");
const path = require("path");
const fs = require("fs");
const formidable = require('formidable');
const mongoose = require('mongoose');
const Post = require("../model/Post");
const { uploadFileSync, removeFileSync } = require("../extensions/uploadExtensions");

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
        if (data.fa_metatag_title === null || data.fa_metatag_title === undefined || data.fa_metatag_title.length === 0) {
            result = false;
        }
        if (data.en_metatag_title === null || data.en_metatag_title === undefined || data.en_metatag_title.length === 0) {
            result = false;
        }
        if (data.fa_metatag_description === null || data.fa_metatag_description === undefined || data.fa_metatag_description.length === 0) {
            result = false;
        }
        if (data.en_metatag_description === null || data.en_metatag_description === undefined || data.en_metatag_description.length === 0) {
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
                estimateTimeInMinutes: model.estimateTimeInMinutes,
                tags: model.tags,
                fa_metatag_title: model.fa_metatag_title,
                en_metatag_title: model.en_metatag_title,
                fa_metatag_description: model.fa_metatag_description,
                en_metatag_description: model.en_metatag_description
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

            const dbModel = await Post.findOne({ _id: model._id });

            if (model.fa_fileChanged) {
                model.fa_fileUrl = await uploadFileSync(files, "fa_file", `post/${model._id}`);
                const filePath = path.join('public', 'post', model._id.toString(), dbModel.fa_fileUrl);
                await removeFileSync(filePath);
            }
            if (model.en_fileChanged) {
                model.en_fileUrl = await uploadFileSync(files, "en_file", `post/${model._id}`);
                const filePath = path.join('public', 'post', model._id.toString(), dbModel.en_fileUrl);
                await removeFileSync(filePath);
            }
            if (model.deu_fileChanged) {
                model.deu_fileUrl = await uploadFileSync(files, "deu_file", `post/${model._id}`);
                const filePath = path.join('public', 'post', model._id.toString(), dbModel.deu_fileUrl);
                await removeFileSync(filePath);
            }
            if (model.coverChanged) {
                model.coverUrl = await uploadFileSync(files, "cover", `post/${model._id}`);
                const filePath = path.join('public', 'post', model._id.toString(), dbModel.coverUrl);
                await removeFileSync(filePath);
            }

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
                        estimateTimeInMinutes: model.estimateTimeInMinutes,
                        tags: model.tags,
                        fa_metatag_title: model.fa_metatag_title,
                        en_metatag_title: model.en_metatag_title,
                        fa_metatag_description: model.fa_metatag_description,
                        en_metatag_description: model.en_metatag_description

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
            const filePath = path.join('public', 'post', postId.toString());
            await removeFileSync(filePath, true);
            // await Post.deleteOne({ _id: postId });
        }
        return res.status(200).json({ message: "Successfully deleted!" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { getRecentPosts, getPost, getPosts, createPost, updatePost, deletePost }