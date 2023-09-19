const Post = require("../model/Post");

const getRecentPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(2).exec();
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

const deletePost = async (req, res) => {
    try {
        const id = req.query.id;
        if (id) {
            const result = await Post.deleteOne({ _id: id });
        } else {
            res.status(204).json();
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { getRecentPosts, getPost, deletePost }