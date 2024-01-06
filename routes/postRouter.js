const express = require("express");
const router = express.Router();

const { getRecentPosts, getPost, createPost, updatePost, deletePost, getPosts } = require("../controllers/postController");

router.get("/getRecentPosts", getRecentPosts);
router.get("/getPost", getPost);
router.get("/getPosts", getPosts);
router.post("/createPost", createPost);
router.post("/updatePost", updatePost);
router.post("/deletePost/:postId", deletePost);

module.exports = router;
